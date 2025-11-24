import z from "zod";

import { PlaceSchema } from "./location";

export const PreferenceSchema = z.object({
    id: z.number(),
    prompt: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime().nullable().optional(),
});

export const RoutePreferencesSchema = z.object({
    from: PlaceSchema,
    to: PlaceSchema,
    preferences: z.array(PreferenceSchema),
});

export type Preference = z.infer<typeof PreferenceSchema>;
export type RoutePreferences = z.infer<typeof RoutePreferencesSchema>;
