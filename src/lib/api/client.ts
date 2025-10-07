import config from "../config/environment";

/**
 * API Client Configuration
 */
interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

interface ApiClientConfig {
    baseUrl: string;
    defaultHeaders?: Record<string, string>;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number | null = null
    ) {
        super(message);
        this.name = "ApiError";
    }
}

/**
 * Centralized API client with TypeScript support
 * Handles all HTTP communication with the backend
 */
class ApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(baseUrl: string, defaultHeaders?: Record<string, string>) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = defaultHeaders || {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    /**
     * Main request method
     */
    async request<T = any>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                ...this.defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            // Handle non-2xx responses
            if (!response.ok) {
                await this._handleErrorResponse(response);
            }

            // Parse successful response
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return (await response.json()) as T;
            }

            return (await response.text()) as T;
        } catch (error) {
            // Handle network errors
            if (
                error instanceof TypeError &&
                error.message.includes("Failed to fetch")
            ) {
                throw new ApiError(
                    "Network error. Please check your connection.",
                    "NETWORK_ERROR"
                );
            }

            // Re-throw ApiErrors as-is
            if (error instanceof ApiError) {
                throw error;
            }

            // Unexpected errors
            console.error("Unexpected API error:", error);
            throw new ApiError(
                "Something went wrong. Please try again.",
                "UNKNOWN_ERROR"
            );
        }
    }

    /**
     * Handle error responses from server
     */
    private async _handleErrorResponse(response: Response): Promise<never> {
        let errorData: any;

        try {
            const text = await response.text();
            errorData = text ? JSON.parse(text) : {};
        } catch {
            // Non-JSON error response
            throw new ApiError(
                `Server error (${response.status}). Please try again later.`,
                "SERVER_ERROR",
                response.status
            );
        }

        // Extract error message from various formats
        const message = this._extractErrorMessage(errorData, response.status);
        throw new ApiError(
            message,
            this._getErrorCode(response.status),
            response.status
        );
    }

    /**
     * Extract user-friendly error message from server response
     */
    private _extractErrorMessage(errorData: any, statusCode: number): string {
        // Handle FastAPI validation errors
        if (Array.isArray(errorData.detail)) {
            const errors = errorData.detail
                .map((err: any) => err.msg || err.message)
                .filter(Boolean);
            return errors.length > 0
                ? errors.join(". ")
                : "Invalid request data.";
        }

        // Handle string detail
        if (typeof errorData.detail === "string") {
            return errorData.detail;
        }

        // Handle message field
        if (errorData.message) {
            return errorData.message;
        }

        // Default messages by status code
        return this._getDefaultErrorMessage(statusCode);
    }

    /**
     * Get default error message by status code
     */
    private _getDefaultErrorMessage(statusCode: number): string {
        const messages: Record<number, string> = {
            400: "Invalid request. Please check your input.",
            401: "Authentication failed. Please check your credentials.",
            403: "Access denied.",
            404: "Resource not found.",
            409: "This resource already exists.",
            422: "Invalid data provided.",
            500: "Server error. Please try again later.",
            503: "Service unavailable. Please try again later.",
        };

        return (
            messages[statusCode] || `Request failed with status ${statusCode}.`
        );
    }

    /**
     * Get error code by status
     */
    private _getErrorCode(statusCode: number): string {
        const codes: Record<number, string> = {
            400: "BAD_REQUEST",
            401: "UNAUTHORIZED",
            403: "FORBIDDEN",
            404: "NOT_FOUND",
            409: "CONFLICT",
            422: "VALIDATION_ERROR",
            500: "SERVER_ERROR",
            503: "SERVICE_UNAVAILABLE",
        };

        return codes[statusCode] || "HTTP_ERROR";
    }

    // Convenience methods with proper TypeScript generics
    async get<T = any>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "GET" });
    }

    async post<T = any>(
        endpoint: string,
        data?: any,
        options: RequestOptions = {}
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T = any>(
        endpoint: string,
        data?: any,
        options: RequestOptions = {}
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T = any>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "DELETE" });
    }

    async patch<T = any>(
        endpoint: string,
        data?: any,
        options: RequestOptions = {}
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

const apiClient = new ApiClient(config.apiUrl);
export default apiClient;
