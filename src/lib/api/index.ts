/**
 * API Module
 * Central export point for all API functionality
 *
 * Authentication is now handled by Clerk (@clerk/clerk-expo)
 * This module only exports the generic API client for other backend endpoints
 */
export { default as apiClient, ApiError } from "./client";
export type { ApiError as ApiErrorType } from "./client";
