import axios from "axios";

// If VITE_API_URL is set in production, use it, otherwise default to relative path
const baseURL = import.meta.env.MODE === "development" 
    ? "http://localhost:5001/api"
    : import.meta.env.VITE_API_URL || "/api";

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true
});