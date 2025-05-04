import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
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
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
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
}));