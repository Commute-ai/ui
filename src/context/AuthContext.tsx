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

    // Initialize: load token from localStorage once on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
            setToken(storedToken);
        }
        setIsLoaded(true); // Only set loaded once we've checked localStorage
    }, []);

    // Fetch user whenever token changes
    useEffect(() => {
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
    }, [token]);

    // Sync token to localStorage whenever it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("auth_token", token);
        } else {
            localStorage.removeItem("auth_token");
        }
    }, [token]);

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
