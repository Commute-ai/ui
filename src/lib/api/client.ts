import { z } from "zod";

import config from "@/lib/config";

import { ApiError, ApiErrorCode } from "@/types/api";

export interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

export interface ApiClientConfig {
    baseUrl: string;
    defaultHeaders?: Record<string, string>;
}

/**
 * Centralized API client with TypeScript support
 * Handles all HTTP communication with the backend
 */
class ApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;
    private tokenProvider?: () => Promise<string | null>;

    constructor(baseUrl: string, defaultHeaders?: Record<string, string>) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = defaultHeaders || {
            "Content-Type": "application/json",
            Accept: "application/json",
        };
    }

    setTokenProvider(provider: () => Promise<string | null>) {
        this.tokenProvider = provider;
    }

    /**
     * Main request method with optional Zod schema validation
     */
    async request<T = any>(
        endpoint: string,
        options: RequestOptions = {},
        schema?: z.ZodSchema<T>
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        if (this.tokenProvider && !options.headers?.["Authorization"]) {
            const token = await this.tokenProvider();
            if (token) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                };
            }
        }

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
            let data: any;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            // Validate with Zod schema if provided
            if (schema) {
                try {
                    return schema.parse(data);
                } catch (error) {
                    if (error instanceof z.ZodError) {
                        console.error(
                            "Response validation failed:",
                            error.errors
                        );
                        throw new ApiError(
                            "Invalid response format from server",
                            "VALIDATION_ERROR"
                        );
                    }
                    throw error;
                }
            }

            return data as T;
        } catch (error) {
            // Handle network errors
            if (
                error instanceof TypeError &&
                (error.message.includes("Failed to fetch") ||
                    error.message.includes("NetworkError") ||
                    error.message.includes("Network request failed"))
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
                "SERVER_ERROR"
            );
        }

        // Extract error message from various formats
        const message = this._extractErrorMessage(errorData, response.status);
        throw new ApiError(message, this._getErrorCode(response.status));
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
    private _getErrorCode(statusCode: number): ApiErrorCode {
        const codes: Record<number, ApiErrorCode> = {
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

    // Convenience methods with optional schema validation
    async get<T = any>(
        endpoint: string,
        options: RequestOptions = {},
        schema?: z.ZodSchema<T>
    ): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: "GET" }, schema);
    }

    async post<T = any>(
        endpoint: string,
        data?: any,
        options: RequestOptions = {},
        schema?: z.ZodSchema<T>
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                ...options,
                method: "POST",
                body: data ? JSON.stringify(data) : undefined,
            },
            schema
        );
    }

    async put<T = any>(
        endpoint: string,
        data?: any,
        options: RequestOptions = {},
        schema?: z.ZodSchema<T>
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                ...options,
                method: "PUT",
                body: data ? JSON.stringify(data) : undefined,
            },
            schema
        );
    }

    async delete<T = any>(
        endpoint: string,
        options: RequestOptions = {},
        schema?: z.ZodSchema<T>
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            { ...options, method: "DELETE" },
            schema
        );
    }

    async patch<T = any>(
        endpoint: string,
        data?: any,
        options: RequestOptions = {},
        schema?: z.ZodSchema<T>
    ): Promise<T> {
        return this.request<T>(
            endpoint,
            {
                ...options,
                method: "PATCH",
                body: data ? JSON.stringify(data) : undefined,
            },
            schema
        );
    }
}

const apiClient = new ApiClient(config.apiUrl);
export default apiClient;
