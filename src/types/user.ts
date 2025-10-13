import { z } from "zod";

export const UserSchema = z.object({
    id: z.number(),
    username: z.string().min(3).max(30),
    created_at: z.string().refine((date) => !isNaN(Date.parse(date))),
});

export const NewUserSchema = UserSchema.extend({
    password: z.string().min(6).max(100),
}).omit({ id: true, created_at: true });

export type User = z.infer<typeof UserSchema>;
export type NewUser = z.infer<typeof NewUserSchema>;
