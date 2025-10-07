// src/api/__mocks__/client.js

/**
 * Custom error class for API errors (matches real implementation)
 */
class ApiError extends Error {
    constructor(message, code, statusCode = null) {
        super(message);
        this.name = "ApiError";
        this.code = code;
        this.statusCode = statusCode;
    }
}

/**
 * Mock implementation of ApiClient for testing
 */
class MockApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    async request(endpoint) {
        // You can customize responses based on endpoint
        if (endpoint.includes("/error")) {
            throw new ApiError("Mock error", "MOCK_ERROR", 400);
        }

        return { success: true, endpoint };
    }

    async get(endpoint) {
        if (endpoint.includes("/users")) {
            return { data: [{ id: 1, name: "Test User" }] };
        }
        return { data: null };
    }

    async post(endpoint, data) {
        if (endpoint.includes("/auth/login")) {
            return {
                access_token: "mock-token",
                user: { id: 1, username: data.username },
            };
        }
        if (endpoint.includes("/auth/register")) {
            return {
                message: "Registration successful",
                user: { id: 1, username: data.username },
            };
        }
        return { success: true, data };
    }

    async put(endpoint, data) {
        if (endpoint.includes("/ping")) {
            return { success: true, data: { ...data, id: 1 }, pong: true };
        }
        return { success: true, data: { ...data, id: 1 } };
    }

    async delete(endpoint) {
        if (endpoint.includes("/ping")) {
            return { success: true, pong: true };
        }
        return { success: true };
    }
}

// Export both the client instance and the ApiError class
const apiClient = new MockApiClient("http://localhost:8000/api/v1");

export { ApiError };
export default apiClient;
