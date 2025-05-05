import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE==="development" ? "http://localhost:5001":"/api";
interface AuthState {
    authUser: any | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isUpdatingProfile: boolean;
    isCheckingAuth: boolean;
    onlineUsers: any[];
    socket: any | null;
    checkAuth: () => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    login: (data: any) => Promise<void>;
    updateProfile: (data: any) => Promise<any>;
    connectSocket: () => void;
    disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket(); 
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
            get().connectSocket(); 
            // The navigation will happen automatically due to the route protection in App.tsx
        } catch (error) {
            toast.error((error as any).response?.data?.error || "Error signing up");
            console.error("Error signing up:", error);
        }
        finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket(); // Disconnect the socket on logout
        } catch (error) {
            toast.error((error as any).response?.data?.error || "Error logging out");
            console.error("Error logging out:", error);
        }
    },
    login: async (data:any) => {
        try {
            set({ isLoggingIn: true });
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket(); // Connect to the socket after logging in
        } catch (error) {
            toast.error((error as any).response?.data?.error || "Error logging in");
            console.error("Error logging in:", error);
        }
        finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async (data:any) => {
        try {
            set({ isUpdatingProfile: true });
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data }); // Update the authUser state with the new data
            toast.success("Profile updated successfully");
            return res.data; // Return the updated user data
        } catch (error) {
            toast.error((error as any).response?.data?.error || "Error updating profile");
            console.error("Error updating profile:", error);
            throw error; // Re-throw the error so the component can handle it
        }
        finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) {
            console.error("User is not authenticated. Cannot connect to socket.");
            return;
        }
        const socket = io(BASE_URL, {
            auth: {
                userId: authUser._id,
            },
        });
        socket.connect();
        set({ socket });
        socket.on("getOnlineUsers", (usersIds) => {
            set({ onlineUsers: usersIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected)
        {
            get().socket.disconnect();
        }
        set({ socket: null });
    },
}));