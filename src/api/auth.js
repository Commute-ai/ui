import apiClient from "./client";

/**
 * Authentication API
 * Handles all authentication-related API calls
 */
const authApi = {
    /**
     * Register a new user
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {Promise<Object>} Registration response with access token
     */
    async register(email, password) {
        return apiClient.post("/auth/register", { email, password });
    },

    /**
     * Login a user
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {Promise<Object>} Login response with access token
     */
    async login(email, password) {
        return apiClient.post("/auth/login", { email, password });
    },

    /**
     * Logout the current user
     * @returns {Promise<Object>} Logout response
     */
    async logout() {
        return apiClient.post("/auth/logout", {});
    },
};

export default authApi;
