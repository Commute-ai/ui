import z from "zod";

import apiClient from "./client";
import type { NewUser, User } from "@/types/user";
import { UserSchema } from "@/types/user";

const AuthResponseSchema = z.object({
    access_token: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

const authApi = {
    async login(username: string, password: string): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(
            "/auth/login",
            {
                username,
                password,
            },
            {},
            AuthResponseSchema
        );
    },

    async register(data: NewUser): Promise<AuthResponse> {
        return apiClient.post<AuthResponse>(
            "/auth/register",
            data,
            {},
            AuthResponseSchema
        );
    },

    async logout(token: string): Promise<void> {
        return apiClient.post<void>(
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
        return apiClient.get<User>(
            "/users/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            UserSchema
        );
    },
};

export default authApi;
