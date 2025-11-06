import z from "zod";

import apiClient from "./client";

const PreferenceSchema = z.object({
    id: z.number(),
    prompt: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime().nullable().optional(),
});

const PreferencesResponseSchema = z.array(PreferenceSchema);

export type Preference = z.infer<typeof PreferenceSchema>;

const preferencesApi = {
    async getPreferences(): Promise<Preference[]> {
        return apiClient.get<Preference[]>(
            "/users/preferences",
            {},
            PreferencesResponseSchema
        );
    },

    async addPreference(prompt: string): Promise<Preference> {
        return apiClient.post<Preference>(
            "/users/preferences",
            { prompt },
            {},
            PreferenceSchema
        );
    },

    async deletePreference(preferenceId: number): Promise<void> {
        return apiClient.delete<void>(`/users/preferences/${preferenceId}`);
    },
};

export default preferencesApi;
