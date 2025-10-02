import authApi from "../../api/auth";
import apiClient from "../../api/client";

// Mock the API client
jest.mock("../../api/client", () => ({
    post: jest.fn(),
}));

describe("Auth API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("register", () => {
        it("calls apiClient.post with correct endpoint and data", async () => {
            const mockResponse = { access_token: "token123" };
            apiClient.post.mockResolvedValueOnce(mockResponse);

            const result = await authApi.register(
                "test@example.com",
                "password123"
            );

            expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
                email: "test@example.com",
                password: "password123",
            });
            expect(result).toEqual(mockResponse);
        });

        it("propagates errors from apiClient", async () => {
            const error = new Error("Registration failed");
            apiClient.post.mockRejectedValueOnce(error);

            await expect(
                authApi.register("test@example.com", "password123")
            ).rejects.toThrow("Registration failed");
        });
    });

    describe("login", () => {
        it("calls apiClient.post with correct endpoint and data", async () => {
            const mockResponse = { access_token: "token123" };
            apiClient.post.mockResolvedValueOnce(mockResponse);

            const result = await authApi.login(
                "test@example.com",
                "password123"
            );

            expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
                email: "test@example.com",
                password: "password123",
            });
            expect(result).toEqual(mockResponse);
        });
    });

    describe("logout", () => {
        it("calls apiClient.post with correct endpoint", async () => {
            const mockResponse = { success: true };
            apiClient.post.mockResolvedValueOnce(mockResponse);

            const result = await authApi.logout();

            expect(apiClient.post).toHaveBeenCalledWith("/auth/logout", {});
            expect(result).toEqual(mockResponse);
        });
    });
});
