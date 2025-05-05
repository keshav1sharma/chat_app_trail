import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

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

export const useChatStore = create((set, get) => ({
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
        const {selectedUser, messages} = get() as any;
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            if (!res.data || !res.data.senderId) {
                throw new Error('Invalid message data received');
            }
            set({messages: [...messages, res.data]});
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        }
    },

    setSelectedUser: (user: User | null) => {
        set({selectedUser: user});
    }
}));