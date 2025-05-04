import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.error("Error checking auth:", error);
            set({ authUser: null});
        }
        finally {
          set({ isCheckingAuth: false });
        }
    },
    signup: async (data:any) => {
        try {
            set({ isSigningUp: true });
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            // The navigation will happen automatically due to the route protection in App.tsx
        } catch (error) {
            toast.error((error as any).response?.data?.error || "Error signing up");
            console.error("Error signing up:", error);
        }
        finally {
            set({ isSigningUp: false });
        }
    },
}));