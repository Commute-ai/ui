import React from "react";

import { act, renderHook, waitFor } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";

import authApi from "@/lib/api/auth";

import { useAuth } from "@/hooks/useAuth";

import { AuthProvider } from "@/context/AuthContext";
import { ApiError } from "@/types/api";
import type { User } from "@/types/user";

// Mock the auth API
jest.mock("@/lib/api/auth");

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

describe("AuthContext", () => {
    const mockUser: User = {
        id: 1,
        username: "testuser",
    };

    const mockToken = "test-token-123";

    beforeEach(() => {
        jest.clearAllMocks();
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
        (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
        (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
    });

    describe("useAuth hook", () => {
        it("throws error when used outside AuthProvider", () => {
            // Suppress console.error for this test
            const consoleError = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            expect(() => {
                renderHook(() => useAuth());
            }).toThrow("useAuth must be used within an AuthProvider");

            consoleError.mockRestore();
        });

        it("returns context when used inside AuthProvider", async () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            expect(result.current).toBeDefined();
            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);
        });
    });

    describe("AuthProvider initialization", () => {
        it("initializes with no user when no token in SecureStore", async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith("auth_token");
        });

        it("initializes with user when valid token exists in SecureStore", async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
                mockToken
            );
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });

            expect(result.current.isSignedIn).toBe(true);
            expect(authApi.getCurrentUser).toHaveBeenCalledWith(mockToken);
        });

        it("clears invalid token from SecureStore on initialization", async () => {
            // Suppress console.error for this test since we expect an error
            const consoleError = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
                mockToken
            );
            (authApi.getCurrentUser as jest.Mock).mockRejectedValue(
                new Error("Invalid token")
            );

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            expect(result.current.user).toBeNull();
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
                "auth_token"
            );

            consoleError.mockRestore();
        });
    });

    describe("signIn", () => {
        it("successfully signs in user", async () => {
            (authApi.login as jest.Mock).mockResolvedValue({
                access_token: mockToken,
            });
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await act(async () => {
                await result.current.signIn("testuser", "password");
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });

            expect(result.current.isSignedIn).toBe(true);
            expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
                "auth_token",
                mockToken
            );
        });

        it("throws error on failed sign in", async () => {
            const errorMessage = "Invalid credentials";
            (authApi.login as jest.Mock).mockRejectedValue(
                new ApiError(errorMessage, "UNAUTHORIZED")
            );

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await expect(
                result.current.signIn("testuser", "wrongpassword")
            ).rejects.toThrow(errorMessage);

            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);
        });
    });

    describe("signOut", () => {
        it("successfully signs out user", async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
                mockToken
            );
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });

            await act(async () => {
                await result.current.signOut();
            });

            await waitFor(() => {
                expect(result.current.user).toBeNull();
            });

            expect(result.current.isSignedIn).toBe(false);
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
                "auth_token"
            );
        });
    });

    describe("getToken", () => {
        it("retrieves token from SecureStore", async () => {
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
                mockToken
            );

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            const token = await result.current.getToken();

            expect(token).toBe(mockToken);
            expect(SecureStore.getItemAsync).toHaveBeenCalledWith("auth_token");
        });
    });
});
