import React from "react";

import { act, renderHook, waitFor } from "@testing-library/react-native";

import authApi from "@/lib/api/auth";

import { useAuth } from "@/hooks/useAuth";

import { AuthProvider } from "@/context/AuthContext";
import { ApiError } from "@/types/api";
import type { User } from "@/types/user";

// Mock the auth API
jest.mock("@/lib/api/auth");

// Mock localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
};

Object.defineProperty(global, "localStorage", {
    value: mockLocalStorage,
    writable: true,
});

describe("AuthContext", () => {
    const mockUser: User = {
        id: "1",
        username: "testuser",
    };

    const mockToken = "test-token-123";

    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.getItem.mockReturnValue(null);
        mockLocalStorage.setItem.mockImplementation(() => {});
        mockLocalStorage.removeItem.mockImplementation(() => {});
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

        it("returns context when used inside AuthProvider", () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            expect(result.current).toBeDefined();
            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);
        });
    });

    describe("AuthProvider initialization", () => {
        it("initializes with no user when no token in localStorage", async () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);
        });

        it("loads user from localStorage token on initialization", async () => {
            mockLocalStorage.getItem.mockReturnValue(mockToken);
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            expect(authApi.getCurrentUser).toHaveBeenCalledWith(mockToken);
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isSignedIn).toBe(true);
        });

        it("clears invalid token from localStorage on initialization error", async () => {
            mockLocalStorage.getItem.mockReturnValue("invalid-token");
            (authApi.getCurrentUser as jest.Mock).mockRejectedValue(
                new Error("Invalid token")
            );

            const consoleError = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
                "auth_token"
            );
            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);

            consoleError.mockRestore();
        });
    });

    describe("signIn", () => {
        it("successfully signs in user and stores token", async () => {
            const mockResponse = {
                access_token: mockToken,
            };

            (authApi.login as jest.Mock).mockResolvedValue(mockResponse);
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await act(async () => {
                await result.current.signIn("testuser", "password123");
            });

            expect(authApi.login).toHaveBeenCalledWith(
                "testuser",
                "password123"
            );
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                "auth_token",
                mockToken
            );
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isSignedIn).toBe(true);
        });

        it("throws error on login failure", async () => {
            const mockError = new ApiError(
                "Invalid credentials",
                "UNAUTHORIZED"
            );
            (authApi.login as jest.Mock).mockRejectedValue(mockError);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await expect(
                act(async () => {
                    await result.current.signIn("testuser", "wrongpassword");
                })
            ).rejects.toThrow("Invalid credentials");
        });
    });

    describe("signUp", () => {
        it("successfully signs up user and stores token", async () => {
            const mockResponse = {
                access_token: mockToken,
            };

            (authApi.register as jest.Mock).mockResolvedValue(mockResponse);
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await act(async () => {
                await result.current.signUp("newuser", "password123");
            });

            expect(authApi.register).toHaveBeenCalledWith({
                username: "newuser",
                password: "password123",
            });
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                "auth_token",
                mockToken
            );
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isSignedIn).toBe(true);
        });

        it("throws error on registration failure", async () => {
            const mockError = new ApiError(
                "Username already exists",
                "CONFLICT"
            );
            (authApi.register as jest.Mock).mockRejectedValue(mockError);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await expect(
                act(async () => {
                    await result.current.signUp("existinguser", "password123");
                })
            ).rejects.toThrow("Username already exists");
        });
    });

    describe("signOut", () => {
        it("successfully signs out user and clears token", async () => {
            // First sign in
            mockLocalStorage.getItem.mockReturnValue(mockToken);
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
            (authApi.logout as jest.Mock).mockResolvedValue({});

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
                expect(result.current.isSignedIn).toBe(true);
            });

            // Then sign out
            await act(async () => {
                await result.current.signOut();
            });

            expect(authApi.logout).toHaveBeenCalled();
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
                "auth_token"
            );
            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);
        });
    });

    describe("getToken", () => {
        it("returns the current token", async () => {
            mockLocalStorage.getItem.mockReturnValue(mockToken);
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            const token = await result.current.getToken();
            expect(token).toBe(mockToken);
        });

        it("returns null when no token is available", async () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            const token = await result.current.getToken();
            expect(token).toBeNull();
        });
    });
});
