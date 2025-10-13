import apiClient from "./client";
import type { NewUser, User } from "@/types/user";

export interface AuthResponse {
    token: string;
    user: User;
}

const authApi = {
    async login(username: string, password: string): Promise<AuthResponse> {
        const body = new URLSearchParams();
        body.append("username", username);
        body.append("password", password);

        return apiClient.request("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body.toString(),
        });
    },

    async register(data: NewUser): Promise<AuthResponse> {
        return apiClient.post("/auth/register", data);
    },

    async logout(token: string): Promise<void> {
        return apiClient.post(
            "/auth/logout",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },

    async getCurrentUser(token: string): Promise<User> {
        return apiClient.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

export default authApi;
