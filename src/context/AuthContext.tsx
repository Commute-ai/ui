import React, { ReactNode, createContext, useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import z from "zod";

import authApi from "@/lib/api/auth";

import { ApiError } from "@/types/api";
import { NewUserSchema, type User } from "@/types/user";

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

const AUTH_TOKEN_KEY = "auth_token";

// Helper for platform-specific storage
const tokenStorage = {
    getItem: async () => {
        if (Platform.OS === "web") {
            try {
                return localStorage.getItem(AUTH_TOKEN_KEY);
            } catch (e) {
                console.error("localStorage is not available.", e);
                return null;
            }
        }
        return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    },
    setItem: async (token: string) => {
        if (Platform.OS === "web") {
            try {
                localStorage.setItem(AUTH_TOKEN_KEY, token);
            } catch (e) {
                console.error("localStorage is not available.", e);
            }
        } else {
            await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
        }
    },
    deleteItem: async () => {
        if (Platform.OS === "web") {
            try {
                localStorage.removeItem(AUTH_TOKEN_KEY);
            } catch (e) {
                console.error("localStorage is not available.", e);
            }
        } else {
            await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
        }
    },
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // Initialize: load token from SecureStore and fetch user if token exists
    useEffect(() => {
        const initialize = async () => {
            try {
                const storedToken = await tokenStorage.getItem();

                if (storedToken) {
                    try {
                        const user = await authApi.getCurrentUser(storedToken);
                        setUser(user);
                        setToken(storedToken);
                    } catch (error) {
                        console.error("Error fetching user on init:", error);
                        // Token is invalid, clear it
                        await tokenStorage.deleteItem();
                    }
                }
            } catch (error) {
                console.error("Error reading from SecureStore:", error);
            }

            setIsLoaded(true);
        };

        initialize();
    }, []);

    // Fetch user whenever token changes
    useEffect(() => {
        if (!isLoaded) return;

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
                setToken(null);
            }
        };

        fetchUser();
    }, [token, isLoaded]);

    // Sync token to SecureStore whenever it changes
    useEffect(() => {
        if (!isLoaded) return;

        const syncToken = async () => {
            try {
                if (token) {
                    await tokenStorage.setItem(token);
                } else {
                    await tokenStorage.deleteItem();
                }
            } catch (error) {
                console.error("Error writing to SecureStore:", error);
            }
        };

        syncToken();
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
            const newUser = NewUserSchema.parse({ username, password });
            const response = await authApi.register(newUser);
            setToken(response.access_token);
        } catch (error) {
            if (error instanceof ApiError) {
                throw new Error(error.message);
            }
            if (error instanceof z.ZodError) {
                throw new Error(error.errors.map((e) => e.message).join(", "));
            }
            throw new Error("Sign up failed. Please try again.");
        }
    };

    const signOut = async () => {
        try {
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error("Error during sign out:", error);
            throw new Error("Sign out failed. Please try again.");
        }
    };

    const getToken = async (): Promise<string | null> => {
        try {
            return await tokenStorage.getItem();
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoaded,
                isSignedIn: !!user,
                signIn,
                signUp,
                signOut,
                getToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
