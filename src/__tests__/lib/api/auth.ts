import type { AuthResponse } from "@/lib/api/auth";
import authApi from "@/lib/api/auth";
// Import after mocking to get the mocked version
import apiClient, { ApiError } from "@/lib/api/client";

import type { User } from "@/types/user";

// This will automatically use the mock from __mocks__/client.ts
jest.mock("@/lib/api/client");

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("Auth API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("calls apiClient.post with correct endpoint and data", async () => {
            const mockUser: User = {
                id: "1",
                username: "testuser",
            };
            const mockResponse: AuthResponse = {
                token: "token123",
                user: mockUser,
            };

            mockApiClient.post.mockResolvedValueOnce(mockResponse);

            const result = await authApi.register({
                username: "testuser",
                password: "password123",
            });

            expect(mockApiClient.post).toHaveBeenCalledWith("/auth/register", {
                username: "testuser",
                password: "password123",
            });
            expect(result).toEqual(mockResponse);
        });

        it("propagates ApiError from apiClient", async () => {
            const error = new ApiError(
                "Username already exists",
                "CONFLICT",
                409
            );
            mockApiClient.post.mockRejectedValueOnce(error);

            const promise = authApi.register({
                username: "existinguser",
                password: "password123",
            });

            await expect(promise).rejects.toThrow(ApiError);
            await expect(promise).rejects.toMatchObject({
                message: "Username already exists",
                code: "CONFLICT",
                statusCode: 409,
            });
        });
    });

    describe("login", () => {
        it("calls apiClient.request with correct endpoint and data", async () => {
            const mockUser: User = {
                id: "1",
                username: "testuser",
            };
            const mockResponse: AuthResponse = {
                token: "token123",
                user: mockUser,
            };

            mockApiClient.request.mockResolvedValueOnce(mockResponse);

            const result = await authApi.login("testuser", "password123");

            const body = new URLSearchParams();
            body.append("username", "testuser");
            body.append("password", "password123");

            expect(mockApiClient.request).toHaveBeenCalledWith("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: body.toString(),
            });
            expect(result).toEqual(mockResponse);
        });

        it("propagates ApiError for invalid credentials", async () => {
            const error = new ApiError(
                "Invalid credentials",
                "UNAUTHORIZED",
                401
            );
            mockApiClient.request.mockRejectedValueOnce(error);

            const promise = authApi.login("testuser", "wrongpassword");

            await expect(promise).rejects.toThrow(ApiError);
            await expect(promise).rejects.toMatchObject({
                message: "Invalid credentials",
                code: "UNAUTHORIZED",
                statusCode: 401,
            });
        });
    });

    describe("logout", () => {
        it("calls apiClient.post with correct endpoint and token", async () => {
            mockApiClient.post.mockResolvedValueOnce(undefined);

            await authApi.logout("token123");

            expect(mockApiClient.post).toHaveBeenCalledWith(
                "/auth/logout",
                {},
                {
                    headers: {
                        Authorization: "Bearer token123",
                    },
                }
            );
        });

        it("handles logout errors gracefully", async () => {
            const error = new ApiError("Token expired", "UNAUTHORIZED", 401);
            mockApiClient.post.mockRejectedValueOnce(error);

            await expect(authApi.logout("expired-token")).rejects.toThrow(
                ApiError
            );
        });
    });

    describe("getCurrentUser", () => {
        it("calls apiClient.get with correct endpoint and token", async () => {
            const mockUser: User = {
                id: "1",
                username: "testuser",
            };

            mockApiClient.get.mockResolvedValueOnce(mockUser);

            const result = await authApi.getCurrentUser("token123");

            expect(mockApiClient.get).toHaveBeenCalledWith("/auth/me", {
                headers: {
                    Authorization: "Bearer token123",
                },
            });
            expect(result).toEqual(mockUser);
        });

        it("propagates ApiError for invalid token", async () => {
            const error = new ApiError(
                "Invalid or expired token",
                "UNAUTHORIZED",
                401
            );
            mockApiClient.get.mockRejectedValueOnce(error);

            const promise = authApi.getCurrentUser("invalid-token");

            await expect(promise).rejects.toThrow(ApiError);
            await expect(promise).rejects.toMatchObject({
                message: "Invalid or expired token",
                code: "UNAUTHORIZED",
                statusCode: 401,
            });
        });
    });
});
