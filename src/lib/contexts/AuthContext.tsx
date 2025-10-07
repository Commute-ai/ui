import { ReactNode, createContext, useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";

import { authApi } from "@/lib/api";

interface AuthContextType {
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            setIsLoggedIn(!!token);
        } catch (error) {
            console.error("Error checking auth status:", error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await authApi.login(username, password);

            if (response.access_token) {
                await SecureStore.setItemAsync(
                    TOKEN_KEY,
                    response.access_token
                );
                setIsLoggedIn(true);
            } else {
                throw new Error("No access token received");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (username: string, password: string) => {
        try {
            await authApi.register(username, password);
            // Don't automatically log in after registration
            // User should log in manually
        } catch (error: any) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout API error:", error);
            // Continue with local logout even if API call fails
        } finally {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            setIsLoggedIn(false);
        }
    };

    // Don't render children until we've checked auth status
    if (isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}
