import { ApiError } from "../../api/client";

// Mock fetch globally before any imports
global.fetch = jest.fn();

// Mock the config module before importing anything
jest.mock("../../config/environment", () => ({
    default: {
        apiUrl: "http://localhost:8000/api/v1",
    },
}));

describe("API Client", () => {
    let ApiClient;
    let testClient;

    beforeAll(() => {
        // Dynamically import the module after mocks are set
        const clientModule = require("../../api/client");
        ApiClient = clientModule.default.constructor;
        testClient = new ApiClient("http://localhost:8000/api/v1");
    });

    beforeEach(() => {
        global.fetch.mockClear();
        jest.clearAllMocks();
    });

    describe("successful requests", () => {
        it("makes a successful GET request with JSON response", async () => {
            const mockData = { id: 1, name: "Test" };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: (header) =>
                        header === "content-type" ? "application/json" : null,
                },
                json: () => Promise.resolve(mockData),
            });

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

            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: () => "application/json",
                },
                json: () => Promise.resolve(mockData),
            });

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
            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: {
                    get: () => "text/plain",
                },
                text: () => Promise.resolve(textResponse),
            });

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

            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 422,
                headers: {
                    get: (header) =>
                        header === "content-type" ? "application/json" : null,
                },
                text: () => Promise.resolve(JSON.stringify(errorResponse)),
            });

            try {
                await testClient.post("/auth/register", {});
                expect(true).toBe(false);
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.message).toBe(
                    "Username is required. Password must be at least 6 characters"
                );
                expect(error.code).toBe("VALIDATION_ERROR");
                expect(error.statusCode).toBe(422);
            }
        });

        it("throws ApiError with string detail", async () => {
            const errorResponse = {
                detail: "Username already exists",
            };

            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 409,
                headers: { get: () => null },
                text: () => Promise.resolve(JSON.stringify(errorResponse)),
            });

            try {
                await testClient.post("/auth/register", {});
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.message).toBe("Username already exists");
                expect(error.code).toBe("CONFLICT");
                expect(error.statusCode).toBe(409);
            }
        });

        it("throws ApiError with default message for known status codes", async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                headers: { get: () => null },
                text: () => Promise.resolve(JSON.stringify({})),
            });

            try {
                await testClient.get("/protected");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.message).toBe(
                    "Authentication failed. Please check your credentials."
                );
                expect(error.code).toBe("UNAUTHORIZED");
                expect(error.statusCode).toBe(401);
            }
        });

        it("throws ApiError when server returns non-JSON error", async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                headers: { get: () => null },
                text: () => Promise.resolve("Internal Server Error"),
            });

            try {
                await testClient.get("/test");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.message).toBe(
                    "Server error (500). Please try again later."
                );
                expect(error.code).toBe("SERVER_ERROR");
                expect(error.statusCode).toBe(500);
            }
        });

        it("throws ApiError for network failures", async () => {
            const networkError = new TypeError("Failed to fetch");
            global.fetch.mockRejectedValueOnce(networkError);

            try {
                await testClient.post("/auth/register", {});
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.message).toBe(
                    "Network error. Please check your connection."
                );
                expect(error.code).toBe("NETWORK_ERROR");
            }
        });

        it("throws ApiError for unexpected errors", async () => {
            const unexpectedError = new Error("Something weird happened");
            global.fetch.mockRejectedValueOnce(unexpectedError);

            try {
                await testClient.get("/test");
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                expect(error.message).toBe(
                    "Something went wrong. Please try again."
                );
                expect(error.code).toBe("UNKNOWN_ERROR");
            }
        });
    });

    describe("convenience methods", () => {
        it("PUT request works correctly", async () => {
            const mockData = { success: true };
            const putData = { name: "Updated Name" };

            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve(mockData),
            });

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

            global.fetch.mockResolvedValueOnce({
                ok: true,
                headers: { get: () => "application/json" },
                json: () => Promise.resolve(mockData),
            });

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
