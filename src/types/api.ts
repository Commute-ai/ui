export type ApiErrorCode =
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "VALIDATION_ERROR"
    | "SERVER_ERROR"
    | "SERVICE_UNAVAILABLE"
    | "NETWORK_ERROR"
    | "UNKNOWN_ERROR"
    | "HTTP_ERROR";

export class ApiError extends Error {
    constructor(
        message: string,
        public code: ApiErrorCode
    ) {
        super(message);
        this.name = "ApiError";
    }
}
