import React from "react";

import { renderHook, waitFor, act } from "@testing-library/react-native";
import { AuthProvider, AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/types/user";

// Mock the auth API
jest.mock("../../lib/api/auth", () => ({
    __esModule: true,
    default: {
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
        getCurrentUser: jest.fn(),
    },
}));

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
        email: "test@example.com",
        created_at: new Date("2024-01-01"),
        updated_at: new Date("2024-01-01"),
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
            const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

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

            const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");
            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);

            consoleError.mockRestore();
        });
    });

    describe("signIn", () => {
        it("successfully signs in user and stores token", async () => {
            const mockResponse = {
                token: mockToken,
                user: mockUser,
            };

            (authApi.login as jest.Mock).mockResolvedValue(mockResponse);

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

            expect(authApi.login).toHaveBeenCalledWith("testuser", "password123");
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith("auth_token", mockToken);
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isSignedIn).toBe(true);
        });

        it("throws error with ApiError message on sign in failure", async () => {
            const apiError = new ApiError("Invalid credentials", "AUTH_ERROR", 401);
            (authApi.login as jest.Mock).mockRejectedValue(apiError);

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

            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);
        });

        it("throws generic error on non-ApiError failure", async () => {
            (authApi.login as jest.Mock).mockRejectedValue(new Error("Network error"));

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await expect(
                act(async () => {
                    await result.current.signIn("testuser", "password123");
                })
            ).rejects.toThrow("Sign in failed. Please try again.");
        });
    });

    describe("signUp", () => {
        it("successfully signs up user and stores token", async () => {
            const mockResponse = {
                token: mockToken,
                user: mockUser,
            };

            (authApi.register as jest.Mock).mockResolvedValue(mockResponse);

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
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith("auth_token", mockToken);
            expect(result.current.user).toEqual(mockUser);
            expect(result.current.isSignedIn).toBe(true);
        });

        it("throws error with ApiError message on sign up failure", async () => {
            const apiError = new ApiError("Username already exists", "VALIDATION_ERROR", 422);
            (authApi.register as jest.Mock).mockRejectedValue(apiError);

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

            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);
        });

        it("throws generic error on non-ApiError failure", async () => {
            (authApi.register as jest.Mock).mockRejectedValue(new Error("Server error"));

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await expect(
                act(async () => {
                    await result.current.signUp("newuser", "password123");
                })
            ).rejects.toThrow("Sign up failed. Please try again.");
        });
    });

    describe("signOut", () => {
        it("successfully signs out user and clears token", async () => {
            // First, set up authenticated state
            mockLocalStorage.getItem.mockReturnValue(mockToken);
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
            (authApi.logout as jest.Mock).mockResolvedValue(undefined);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
                expect(result.current.isSignedIn).toBe(true);
            });

            await act(async () => {
                await result.current.signOut();
            });

            expect(authApi.logout).toHaveBeenCalledWith(mockToken);
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");
            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);
        });

        it("clears local state even if logout API call fails", async () => {
            // First, set up authenticated state
            mockLocalStorage.getItem.mockReturnValue(mockToken);
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
            (authApi.logout as jest.Mock).mockRejectedValue(new Error("Network error"));

            const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
                expect(result.current.isSignedIn).toBe(true);
            });

            await act(async () => {
                await result.current.signOut();
            });

            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");
            expect(result.current.user).toBeNull();
            expect(result.current.isSignedIn).toBe(false);

            consoleError.mockRestore();
        });

        it("signs out successfully when no token exists", async () => {
            (authApi.logout as jest.Mock).mockResolvedValue(undefined);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            await act(async () => {
                await result.current.signOut();
            });

            // Should not call API when no token
            expect(authApi.logout).not.toHaveBeenCalled();
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");
            expect(result.current.user).toBeNull();
        });
    });

    describe("getToken", () => {
        it("returns current token when user is signed in", async () => {
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

        it("returns null when user is not signed in", async () => {
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

    describe("isSignedIn derived state", () => {
        it("returns false when user is null", async () => {
            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            expect(result.current.isSignedIn).toBe(false);
        });

        it("returns true when user exists", async () => {
            mockLocalStorage.getItem.mockReturnValue(mockToken);
            (authApi.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <AuthProvider>{children}</AuthProvider>
            );

            const { result } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoaded).toBe(true);
            });

            expect(result.current.isSignedIn).toBe(true);
        });
    });
});
