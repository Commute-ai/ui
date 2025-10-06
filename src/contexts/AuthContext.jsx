import storage from "../utils/storage";

import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = await storage.getToken();
            if (token) {
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        };

        checkToken();
    }, []);

    const logout = async () => {
        await storage.removeToken();
        setIsLoggedIn(false);
    };

    if (isLoading && process.env.NODE_ENV !== 'test') {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
