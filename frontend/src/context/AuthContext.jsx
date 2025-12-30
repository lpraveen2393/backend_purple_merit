import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        api.get("/auth/me")
            .then(res => setUser(res.data))
            .catch(() => logout())
            .finally(() => setLoading(false));
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        window.location.href = "/";
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
