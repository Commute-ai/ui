import storage from "../utils/storage";

import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            const storedToken = await storage.getToken();
            if (storedToken) {
                setToken(storedToken);
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        };

        checkToken();
    }, []);

    const logout = async () => {
        await storage.removeToken();
        setIsLoggedIn(false);
        setToken(null);
    };

    if (isLoading && process.env.NODE_ENV !== "test") {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
