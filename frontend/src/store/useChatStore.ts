import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    ismessagesLoading: false,

    getUsers: async()=>{
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
    }
    ,
    getMessages: async(userId:any)=>{
        set({ismessagesLoading: true});
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages: response.data});
        } catch (error) {
            toast.error('Failed to load messages');
        }
        finally {
            set({ismessagesLoading: false});
        }
    },
    //todo optimize it later
    setSelectedUser: (user:any) => {
        set({selectedUser: user});
    }
})));