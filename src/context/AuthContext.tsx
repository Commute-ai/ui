import React, { ReactNode, createContext, useEffect, useState } from "react";

import authApi from "@/lib/api/auth";
import type { User } from "@/types/user";
import { ApiError } from "@/types/api";

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

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            const storedToken = localStorage.getItem("auth_token");

            if (storedToken) {
                setToken(storedToken);

                // Fetch current user using auth API
                const userResponse = await authApi.getCurrentUser(storedToken);

                // Convert API response to User with Date objects
                setUser(userResponse);
            }
        } catch (error) {
            console.error("Auth initialization error:", error);
            // Token invalid, clear it
            localStorage.removeItem("auth_token");
            setToken(null);
        } finally {
            setIsLoaded(true);
        }
    };

    const signIn = async (username: string, password: string) => {
        try {
            const response = await authApi.login(username, password);
            localStorage.setItem("auth_token", response.token);
            setToken(response.token);
            setUser(response.user);
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

            localStorage.setItem("auth_token", response.token);
            setToken(response.token);
            setUser(response.user);
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
            localStorage.removeItem("auth_token");
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
