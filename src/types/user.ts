import { z } from "zod";

export const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    created_at: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)))
        .optional(),
});

export const NewUserSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be at most 100 characters"),
});

export type User = z.infer<typeof UserSchema>;
export type NewUser = z.infer<typeof NewUserSchema>;
