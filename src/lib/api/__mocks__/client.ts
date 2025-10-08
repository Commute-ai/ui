import { ApiError, RequestOptions } from "../client";

/**
 * Mock implementation of ApiClient for testing
 */
class MockApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseUrl: string, defaultHeaders?: Record<string, string>) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = defaultHeaders || {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    async request<T = any>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        // Simulate error endpoints
        if (endpoint.includes("/error")) {
            throw new ApiError("Mock error", "MOCK_ERROR", 400);
        }

        if (endpoint.includes("/unauthorized")) {
            throw new ApiError("Unauthorized", "UNAUTHORIZED", 401);
        }

        if (endpoint.includes("/not-found")) {
            throw new ApiError("Not found", "NOT_FOUND", 404);
        }

        // Default successful response
        return {
            success: true,
            endpoint,
            method: options.method || "GET",
        } as T;
    }

    async get<T = any>(
        endpoint: string,
        options: RequestOptions = {} // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<T> {
        if (endpoint.includes("/auth/me")) {
            return {
                id: "1",
                username: "testuser",
                email: "test@example.com",
                created_at: new Date("2024-01-01"),
                updated_at: new Date("2024-01-01"),
            } as T;
        }

        if (endpoint.includes("/users")) {
            return { data: [{ id: "1", username: "Test User" }] } as T;
        }

        return { data: null } as T;
    }

    async post<T = any>(
        endpoint: string,
        data?: any,
        options: RequestOptions = {} // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<T> {
        if (endpoint.includes("/auth/login")) {
            return {
                token: "mock-token-123",
                user: {
                    id: "1",
                    username: data?.username || "testuser",
                    email: "test@example.com",
                    created_at: new Date("2024-01-01"),
                    updated_at: new Date("2024-01-01"),
                },
            } as T;
        }

        if (endpoint.includes("/auth/register")) {
            return {
                token: "mock-token-456",
                user: {
                    id: "2",
                    username: data?.username || "newuser",
                    email: "newuser@example.com",
                    created_at: new Date("2024-01-01"),
                    updated_at: new Date("2024-01-01"),
                },
            } as T;
        }

        if (endpoint.includes("/auth/logout")) {
            return { success: true } as T;
        }

        return { success: true, data } as T;
    }

    async put<T = any>(
        endpoint: string,
        data?: any,
        options: RequestOptions = {} // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<T> {
        if (endpoint.includes("/ping")) {
            return {
                success: true,
                data: { ...data, id: "1" },
                pong: true,
            } as T;
        }
        return { success: true, data: { ...data, id: "1" } } as T;
    }

    async delete<T = any>(
        endpoint: string,
        options: RequestOptions = {} // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<T> {
        if (endpoint.includes("/ping")) {
            return { success: true, pong: true } as T;
        }
        return { success: true } as T;
    }

    async patch<T = any>(
        endpoint: string, // eslint-disable-line no-unused-vars
        data?: any,
        options: RequestOptions = {} // eslint-disable-line @typescript-eslint/no-unused-vars
    ): Promise<T> {
        return { success: true, data: { ...data, id: "1" } } as T;
    }
}

// Export both the client instance and the ApiError class
const apiClient = new MockApiClient("http://localhost:8000/api/v1");

export default apiClient;
