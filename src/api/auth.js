import apiClient from "./client";

/**
 * Authentication API
 * Handles all authentication-related API calls
 */
const authApi = {
    /**
     * Register a new user
     * @param {string} username - User's username
     * @param {string} password - User's password
     * @returns {Promise<Object>} Registration response with access token
     */
    async register(username, password) {
        return apiClient.post("/auth/register", { username, password });
    },

    /**
     * Login a user
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {Promise<Object>} Login response with access token
     */
    async login(email, password) {
        const body = new URLSearchParams();
        body.append("username", email);
        body.append("password", password);

        return apiClient.request("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });
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
