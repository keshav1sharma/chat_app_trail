import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

interface User {
    _id: string;
    fullName: string;
    profilePic?: string;
}

interface Message {
    _id: string;
    text: string;
    image?: string;
    senderId: User;
    receiverId: string;
    createdAt: string;
}

interface ChatStore {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (messageData: { text: string; image?: string }) => Promise<void>;
    subscribeToMessages: (callback: (message: Message) => void) => void;
    unsubscribeFromMessages: () => void;
    setSelectedUser: (user: User | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [] as Message[],
    users: [] as User[],
    selectedUser: null as User | null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true});
        try {
            const response = await axiosInstance.get('/messages/user');
            set({users: response.data});
        } catch (error) {
            toast.error('Failed to load users');
            console.error('Error loading users:', error);
        }
        finally {
            set({isUsersLoading: false});
        }
    },

    getMessages: async (userId: string) => {
        set({isMessagesLoading: true});
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages: response.data});
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to load messages');
        }
        finally {
            set({isMessagesLoading: false});
        }
    },

    sendMessage: async (messageData: { text: string; image?: string }) => {
        const {selectedUser, messages} = get() as ChatStore;
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`, messageData);
            if (!res.data || !res.data.senderId) {
                throw new Error('Invalid message data received');
            }
            set({messages: [...messages, res.data]});
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        }
    },
    subscribeToMessages: (callback: (message: Message) => void) => {
        const {selectedUser} = get() as ChatStore;
        if(!selectedUser) {
            console.error('No selected user to subscribe to messages');
            return;
        }
        const socket = useAuthStore.getState().socket;
        if (!socket) {
            console.error('Socket not initialized');
            return;
        }

        socket.on("newMessage", (newMessage: Message) => {
            // Only update messages if they are part of the current conversation
            const isRelevantMessage = 
                (newMessage.senderId._id === selectedUser._id) || 
                (newMessage.receiverId === selectedUser._id);
            
            if (isRelevantMessage) {
                callback(newMessage);
                const state = get() as ChatStore;
                set({
                    messages: [...state.messages, newMessage],
                });
            }
        });
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
        }
    },
    setSelectedUser: (user: User | null) => {
        set({selectedUser: user});
    }
}));