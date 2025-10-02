import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

/**
 * Storage utility for managing authentication tokens
 * Uses SecureStore for native platforms and localStorage for web
 */
const storage = {
    /**
     * Save authentication token securely
     * @param {string} token - Authentication token to store
     */
    async saveToken(token) {
        try {
            if (Platform.OS === "web") {
                // Use localStorage for web
                if (typeof window !== "undefined" && window.localStorage) {
                    window.localStorage.setItem(TOKEN_KEY, token);
                }
            } else {
                // Use SecureStore for native platforms
                await SecureStore.setItemAsync(TOKEN_KEY, token);
            }
        } catch (error) {
            console.error("Error saving token:", error);
            throw new Error("Failed to save authentication token");
        }
    },

    /**
     * Retrieve authentication token
     * @returns {Promise<string|null>} Authentication token or null if not found
     */
    async getToken() {
        try {
            if (Platform.OS === "web") {
                if (typeof window !== "undefined" && window.localStorage) {
                    return window.localStorage.getItem(TOKEN_KEY);
                }
                return null;
            } else {
                return await SecureStore.getItemAsync(TOKEN_KEY);
            }
        } catch (error) {
            console.error("Error retrieving token:", error);
            return null;
        }
    },

    /**
     * Remove authentication token
     */
    async removeToken() {
        try {
            if (Platform.OS === "web") {
                if (typeof window !== "undefined" && window.localStorage) {
                    window.localStorage.removeItem(TOKEN_KEY);
                }
            } else {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
            }
        } catch (error) {
            console.error("Error removing token:", error);
            throw new Error("Failed to remove authentication token");
        }
    },
};

export default storage;
