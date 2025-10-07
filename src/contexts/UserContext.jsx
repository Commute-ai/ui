import { userService } from "../api";

import React, { createContext, useContext, useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isLoggedIn, token } = useContext(AuthContext);

    useEffect(() => {
        const fetchUser = async () => {
            if (isLoggedIn && token) {
                setIsLoading(true);
                setError(null);
                try {
                    const userData = await userService.getMe(token);
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to fetch user", error);
                    setError(error.message || "Failed to load user data.");
                    setUser(null);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUser(null);
            }
        };

        fetchUser();
    }, [isLoggedIn, token]);

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, error }}>
            {children}
        </UserContext.Provider>
    );
};
