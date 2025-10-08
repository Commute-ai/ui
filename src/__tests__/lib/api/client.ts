import { ApiError } from "../../old/api/client";

// Mock fetch globally before any imports
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Mock the config module before importing anything
jest.mock("../../config/environment", () => ({
    default: {
        apiUrl: "http://localhost:8000/api/v1",
    },
}));

interface MockResponse {
    ok: boolean;
    status?: number;
    headers: {
        get: (header: string) => string | null;
    };
    json?: () => Promise<any>;
    text?: () => Promise<string>;
}

describe("API Client", () => {
    let ApiClient: any;
    let testClient: any;

    beforeAll(() => {
        // Dynamically import the module after mocks are set
        const clientModule = require("../../api/client");
        ApiClient = clientModule.default.constructor;
        testClient = new ApiClient("http://localhost:8000/api/v1");
    });

    beforeEach(() => {
        (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
        jest.clearAllMocks();
    });

    describe("successful requests", () => {
        it("makes a successful GET request with JSON response", async () => {
            const mockData = { id: 1, name: "Test" };
            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: (header: string) =>
                        header === "content-type" ? "application/json" : null,
                },
                json: () => Promise.resolve(mockData),
            } as Response);

            const result = await testClient.get("/test");

            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8000/api/v1/test",
                expect.objectContaining({
                    method: "GET",
                    headers: expect.objectContaining({
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    }),
                })
            );
            expect(result).toEqual(mockData);
        });

        it("makes a successful POST request", async () => {
            const mockData = { success: true };
            const postData = { username: "testuser", password: "password123" };

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: () => "application/json",
                },
                json: () => Promise.resolve(mockData),
            } as Response);

            const result = await testClient.post("/auth/register", postData);

            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8000/api/v1/auth/register",
                expect.objectContaining({
                    method: "POST",
                    headers: expect.objectContaining({
                        "Content-Type": "application/json",
                    }),
                    body: JSON.stringify(postData),
                })
            );
            expect(result).toEqual(mockData);
        });

        it("handles text responses when content-type is not JSON", async () => {
            const textResponse = "Plain text response";
            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: () => "text/plain",
                },
                text: () => Promise.resolve(textResponse),
            } as Response);

            const result = await testClient.get("/test");
            expect(result).toBe(textResponse);
        });
    });

    describe("error handling", () => {
        it("throws ApiError with validation errors (422)", async () => {
            const errorResponse = {
                detail: [
                    { msg: "Username is required" },
                    { msg: "Password must be at least 6 characters" },
                ],
            };

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: false,
                status: 422,
                headers: {
                    get: (header: string) =>
                        header === "content-type" ? "application/json" : null,
                },
                json: () => Promise.resolve(errorResponse),
            } as Response);

            try {
                await testClient.post("/auth/register", {});
                fail("Should have thrown an error");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).message).toBe(
                    "Username is required, Password must be at least 6 characters"
                );
                expect((error as ApiError).code).toBe("VALIDATION_ERROR");
                expect((error as ApiError).statusCode).toBe(422);
            }
        });

        it("throws ApiError for server errors (500)", async () => {
            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: false,
                status: 500,
                headers: {
                    get: () => "application/json",
                },
                json: () => Promise.resolve({ detail: "Internal server error" }),
            } as Response);

            try {
                await testClient.get("/test");
                fail("Should have thrown an error");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).message).toBe(
                    "Server error. Please try again later."
                );
                expect((error as ApiError).code).toBe("SERVER_ERROR");
                expect((error as ApiError).statusCode).toBe(500);
            }
        });

        it("throws ApiError for network failures", async () => {
            const networkError = new TypeError("Failed to fetch");
            (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(networkError);

            try {
                await testClient.post("/auth/register", {});
                fail("Should have thrown an error");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).message).toBe(
                    "Network error. Please check your connection."
                );
                expect((error as ApiError).code).toBe("NETWORK_ERROR");
            }
        });

        it("throws ApiError for unexpected errors", async () => {
            const unexpectedError = new Error("Something weird happened");
            (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(unexpectedError);

            try {
                await testClient.get("/test");
                fail("Should have thrown an error");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect((error as ApiError).message).toBe(
                    "Something went wrong. Please try again."
                );
                expect((error as ApiError).code).toBe("UNKNOWN_ERROR");
            }
        });
    });

    describe("convenience methods", () => {
        it("PUT request works correctly", async () => {
            const mockData = { success: true };
            const putData = { name: "Updated Name" };

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve(mockData),
            } as Response);

            const result = await testClient.put("/users/1", putData);

            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8000/api/v1/users/1",
                expect.objectContaining({
                    method: "PUT",
                    body: JSON.stringify(putData),
                })
            );
            expect(result).toEqual(mockData);
        });

        it("DELETE request works correctly", async () => {
            const mockData = { success: true };

            (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve(mockData),
            } as Response);

            const result = await testClient.delete("/users/1");

            expect(global.fetch).toHaveBeenCalledWith(
                "http://localhost:8000/api/v1/users/1",
                expect.objectContaining({
                    method: "DELETE",
                })
            );
            expect(result).toEqual(mockData);
        });
    });

    describe("ApiError class", () => {
        it("creates ApiError with all properties", () => {
            const error = new ApiError("Test error", "TEST_CODE", 400);

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(ApiError);
            expect(error.name).toBe("ApiError");
            expect(error.message).toBe("Test error");
            expect(error.code).toBe("TEST_CODE");
            expect(error.statusCode).toBe(400);
        });

        it("creates ApiError without statusCode", () => {
            const error = new ApiError("Test error", "TEST_CODE");

            expect(error.message).toBe("Test error");
            expect(error.code).toBe("TEST_CODE");
            expect(error.statusCode).toBeNull();
        });
    });
});
