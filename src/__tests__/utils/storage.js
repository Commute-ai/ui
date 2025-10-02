import storage from "../../utils/storage";

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

// Mock window.localStorage for web tests
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

global.window = {
    localStorage: mockLocalStorage,
};

describe("Storage Utility", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.clear();
    });

    describe("saveToken", () => {
        it("saves token to SecureStore on native platforms", async () => {
            // Mock Platform.OS to be 'ios'
            Platform.OS = "ios";

            const token = "test-token-123";
            await storage.saveToken(token);

            expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
                "auth_token",
                token
            );
        });

        it("saves token to localStorage on web", async () => {
            // Mock Platform.OS to be 'web'
            Platform.OS = "web";

            const token = "test-token-456";

            await storage.saveToken(token);

            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                "auth_token",
                token
            );
        });

        it("throws error on failure", async () => {
            Platform.OS = "ios";
            SecureStore.setItemAsync.mockRejectedValueOnce(
                new Error("Storage error")
            );

            await expect(storage.saveToken("token")).rejects.toThrow(
                "Failed to save authentication token"
            );
        });
    });

    describe("getToken", () => {
        it("retrieves token from SecureStore on native platforms", async () => {
            Platform.OS = "android";
            const token = "retrieved-token";
            SecureStore.getItemAsync.mockResolvedValueOnce(token);

            const result = await storage.getToken();

            expect(SecureStore.getItemAsync).toHaveBeenCalledWith("auth_token");
            expect(result).toBe(token);
        });

        it("retrieves token from localStorage on web", async () => {
            Platform.OS = "web";
            const token = "web-token";

            mockLocalStorage.getItem.mockReturnValue(token);

            const result = await storage.getToken();

            expect(mockLocalStorage.getItem).toHaveBeenCalledWith("auth_token");
            expect(result).toBe(token);
        });

        it("returns null on error", async () => {
            Platform.OS = "ios";
            SecureStore.getItemAsync.mockRejectedValueOnce(
                new Error("Read error")
            );

            const result = await storage.getToken();

            expect(result).toBeNull();
        });
    });

    describe("removeToken", () => {
        it("removes token from SecureStore on native platforms", async () => {
            Platform.OS = "ios";

            await storage.removeToken();

            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
                "auth_token"
            );
        });

        it("removes token from localStorage on web", async () => {
            Platform.OS = "web";

            await storage.removeToken();

            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(
                "auth_token"
            );
        });

        it("throws error on failure", async () => {
            Platform.OS = "android";
            SecureStore.deleteItemAsync.mockRejectedValueOnce(
                new Error("Delete error")
            );

            await expect(storage.removeToken()).rejects.toThrow(
                "Failed to remove authentication token"
            );
        });
    });
});
