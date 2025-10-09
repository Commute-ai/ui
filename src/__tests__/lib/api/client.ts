import apiClient, { ApiError } from "@/lib/api/client";

// Set up global mocks first
global.fetch = jest.fn();

// Mock dependencies
jest.mock("expo-constants", () => ({
    expoConfig: { updates: { channel: null } },
}));

jest.mock("react-native", () => ({
    Platform: { OS: "web" },
}));

jest.mock("@/lib/config/environment", () => ({
    __esModule: true,
    default: { apiUrl: "http://localhost:8000/api/v1" },
}));

describe("API Client", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("successful requests", () => {
        it("makes GET requests", async () => {
            const mockData = { id: 1, name: "Test" };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve(mockData),
            });

            const result = await apiClient.get("/test");
            expect(result).toEqual(mockData);
        });

        it("makes POST requests", async () => {
            const mockData = { success: true };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve(mockData),
            });

            const result = await apiClient.post("/test", { data: "test" });
            expect(result).toEqual(mockData);
        });

        it("makes PUT requests", async () => {
            const mockData = { success: true };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve(mockData),
            });

            const result = await apiClient.put("/test", { data: "test" });
            expect(result).toEqual(mockData);
        });

        it("makes DELETE requests", async () => {
            const mockData = { success: true };
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve(mockData),
            });

            const result = await apiClient.delete("/test");
            expect(result).toEqual(mockData);
        });

        it("handles text responses", async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                headers: { get: () => "text/plain" },
                text: () => Promise.resolve("plain text"),
            });

            const result = await apiClient.get("/test");
            expect(result).toBe("plain text");
        });
    });

    describe("error handling", () => {
        it("handles validation errors (422)", async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 422,
                headers: { get: () => null },
                text: () =>
                    Promise.resolve(
                        JSON.stringify({
                            detail: [
                                { msg: "Username is required" },
                                {
                                    msg: "Password must be at least 6 characters",
                                },
                            ],
                        })
                    ),
            });

            await expect(
                apiClient.post("/auth/register", {})
            ).rejects.toMatchObject({
                name: "ApiError",
                code: "VALIDATION_ERROR",
                statusCode: 422,
            });
        });

        it("handles server errors (500)", async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
                headers: { get: () => null },
                text: () =>
                    Promise.resolve(
                        JSON.stringify({
                            detail: "Internal server error",
                        })
                    ),
            });

            await expect(apiClient.get("/test")).rejects.toMatchObject({
                name: "ApiError",
                code: "SERVER_ERROR",
                statusCode: 500,
            });
        });

        it("handles network errors", async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(
                new TypeError("Failed to fetch")
            );

            await expect(apiClient.post("/test", {})).rejects.toMatchObject({
                name: "ApiError",
                code: "NETWORK_ERROR",
            });
        });

        it("handles unexpected errors", async () => {
            const randomError = new Error("Random error");
            (global.fetch as jest.Mock).mockRejectedValueOnce(randomError);

            // Mock console error so it doesn't show up in tests
            jest.spyOn(console, "error").mockImplementation(() => {});

            await expect(apiClient.get("/test")).rejects.toMatchObject({
                name: "ApiError",
                code: "UNKNOWN_ERROR",
            });

            expect(console.error).toHaveBeenCalledWith("Unexpected API error:", randomError);
        });
    });

    describe("ApiError class", () => {
        it("creates error with all properties", () => {
            const error = new ApiError("Test error", "TEST_CODE", 400);

            expect(error.name).toBe("ApiError");
            expect(error.message).toBe("Test error");
            expect(error.code).toBe("TEST_CODE");
            expect(error.statusCode).toBe(400);
        });

        it("creates error without statusCode", () => {
            const error = new ApiError("Test error", "TEST_CODE");

            expect(error.message).toBe("Test error");
            expect(error.code).toBe("TEST_CODE");
            expect(error.statusCode).toBeNull();
        });
    });
});
