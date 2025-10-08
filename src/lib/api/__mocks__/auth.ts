import type { AuthResponse } from "../auth";

import type { NewUser, User } from "@/types/user";

const mockUsers: Record<string, User> = {
    testuser: {
        id: "1",
        username: "testuser",
    },
    newuser: {
        id: "2",
        username: "newuser",
    },
};

const mockTokens: Record<string, string> = {
    testuser: "mock-token-testuser-123",
    newuser: "mock-token-newuser-456",
    existing: "mock-token-existing-789",
};

const authApi = {
    async login(username: string, password: string): Promise<AuthResponse> {
        // Simulate failed login
        if (password === "wrongpassword") {
            throw new Error("Invalid credentials");
        }

        // Simulate network error
        if (username === "networkerror") {
            throw new Error("Network error. Please check your connection.");
        }

        // Simulate successful login
        const user = mockUsers[username] || mockUsers.testuser;
        const token = mockTokens[username] || mockTokens.testuser;

        return {
            token,
            user,
        };
    },

    async register(data: NewUser): Promise<AuthResponse> {
        // Simulate validation error
        if (data.username === "existinguser") {
            throw new Error("Username already exists");
        }

        // Simulate network error
        if (data.username === "networkerror") {
            throw new Error("Network error. Please check your connection.");
        }

        // Simulate server error
        if (data.username === "servererror") {
            throw new Error("Server error. Please try again later.");
        }

        // Simulate successful registration
        const newUser: User = {
            id: String(Date.now()),
            username: data.username,
        };

        return {
            token: `mock-token-${data.username}-${Date.now()}`,
            user: newUser,
        };
    },

    async logout(token: string): Promise<void> {
        // Simulate logout error (rarely used in tests)
        if (token === "error-token") {
            throw new Error("Logout failed");
        }

        // Successful logout (no return value)
        return;
    },

    async getCurrentUser(token: string): Promise<User> {
        // Simulate invalid/expired token
        if (token === "invalid-token" || token === "expired-token") {
            throw new Error("Invalid or expired token");
        }

        // Find user by token
        const username = Object.keys(mockTokens).find(
            (key) => mockTokens[key] === token
        );

        if (username && mockUsers[username]) {
            return mockUsers[username];
        }

        // Default to testuser for any valid-looking token
        return mockUsers.testuser;
    },
};

export default authApi;
