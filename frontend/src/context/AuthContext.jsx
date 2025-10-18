import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage first
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            }
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });
            if (res?.data?.data?.token) {
                localStorage.setItem("token", res.data.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.data.user));
                setUser(res.data.data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);
            throw error;
        }
    };

    // Optional: fetch latest user data from backend if token exists
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);
            const res = await api.get("/auth/me");
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
