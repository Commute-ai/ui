import React, { ReactNode, createContext, useEffect, useState } from "react";

import authApi from "@/lib/api/auth";

import { ApiError } from "@/types/api";
import type { User } from "@/types/user";

export interface AuthContextType {
    user: User | null;
    isLoaded: boolean;
    isSignedIn: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    signUp: (username: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    getToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // Initialize: load token from localStorage and fetch user if token exists
    useEffect(() => {
        const initialize = async () => {
            const storedToken = localStorage.getItem("auth_token");

            if (storedToken) {
                try {
                    const user = await authApi.getCurrentUser(storedToken);
                    setUser(user);
                    setToken(storedToken);
                } catch (error) {
                    console.error("Error fetching user on init:", error);
                    // Token is invalid, clear it
                    localStorage.removeItem("auth_token");
                }
            }

            setIsLoaded(true); // Now we're truly loaded
        };

        initialize();
    }, []);

    // Fetch user whenever token changes
    useEffect(() => {
        if (!isLoaded) return; // Wait until initial load is done

        if (!token) {
            setUser(null);
            return;
        }

        const fetchUser = async () => {
            try {
                const user = await authApi.getCurrentUser(token);
                setUser(user);
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
                setToken(null); // Invalid token, clear it
            }
        };

        fetchUser();
    }, [token, isLoaded]);

    // Sync token to localStorage whenever it changes
    useEffect(() => {
        if (!isLoaded) return; // Wait until initial load is done

        if (token) {
            localStorage.setItem("auth_token", token);
        } else {
            localStorage.removeItem("auth_token");
        }
    }, [token, isLoaded]);

    const signIn = async (username: string, password: string) => {
        try {
            const response = await authApi.login(username, password);
            setToken(response.access_token);
        } catch (error) {
            if (error instanceof ApiError) {
                throw new Error(error.message);
            }
            throw new Error("Sign in failed. Please try again.");
        }
    };

    const signUp = async (username: string, password: string) => {
        try {
            const response = await authApi.register({
                username,
                password,
            });

            setToken(response.access_token);
        } catch (error) {
            if (error instanceof ApiError) {
                throw new Error(error.message);
            }
            throw new Error("Sign up failed. Please try again.");
        }
    };

    const signOut = async () => {
        try {
            if (token) {
                await authApi.logout(token);
            }
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setToken(null);
            setUser(null);
        }
    };

    const getToken = async (): Promise<string | null> => {
        return token;
    };

    const value: AuthContextType = {
        user,
        isLoaded,
        isSignedIn: !!user,
        signIn,
        signUp,
        signOut,
        getToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
