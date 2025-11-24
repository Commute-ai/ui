import { locationService } from "../location";

import { z } from "zod";

import apiClient from "./client";
import { Coordinates } from "@/types/geo";
import {
    Preference,
    PreferenceSchema,
    RoutePreferences,
} from "@/types/preferences";

// API-specific schemas (only used by this API module)
const NewPreferenceSchema = z.object({
    prompt: z.string(),
});

const RoutePreferenceCreateSchema = z.object({
    prompt: z.string(),
    from_latitude: z.number(),
    from_longitude: z.number(),
    to_latitude: z.number(),
    to_longitude: z.number(),
});

const RoutePreferenceResponseSchema = z.object({
    id: z.number(),
    prompt: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime().nullable().optional(),
    from_latitude: z.number(),
    from_longitude: z.number(),
    to_latitude: z.number(),
    to_longitude: z.number(),
});

type RoutePreferenceResponse = z.infer<typeof RoutePreferenceResponseSchema>;

// Helper to create a unique key for route coordinates
const getRouteKey = (from: Coordinates, to: Coordinates) =>
    `${from.latitude},${from.longitude},${to.latitude},${to.longitude}`;

const preferencesApi = {
    async getPreferences(): Promise<Preference[]> {
        return apiClient.get<Preference[]>(
            "/users/preferences",
            {},
            z.array(PreferenceSchema)
        );
    },

    async addPreference(prompt: string): Promise<Preference> {
        const newPreference = NewPreferenceSchema.parse({ prompt });
        return apiClient.post<Preference>(
            "/users/preferences",
            newPreference,
            {},
            PreferenceSchema
        );
    },

    async deletePreference(preferenceId: number): Promise<void> {
        return apiClient.delete<void>(`/users/preferences/${preferenceId}`);
    },

    // Get all route preferences and group them by route
    async getRoutePreferences(): Promise<RoutePreferences[]> {
        const routePreferenceResponses = await apiClient.get<
            RoutePreferenceResponse[]
        >(
            "/users/route-preferences",
            {},
            z.array(RoutePreferenceResponseSchema)
        );

        // Convert API responses to regular preferences
        const preferences: (Preference & {
            from: Coordinates;
            to: Coordinates;
        })[] = routePreferenceResponses.map((resp) => ({
            id: resp.id,
            prompt: resp.prompt,
            created_at: resp.created_at,
            updated_at: resp.updated_at,
            from: {
                latitude: resp.from_latitude,
                longitude: resp.from_longitude,
            },
            to: { latitude: resp.to_latitude, longitude: resp.to_longitude },
        }));

        // Group by route coordinates
        const routeMap = new Map<string, RoutePreferences>();

        for (const pref of preferences) {
            const routeKey = getRouteKey(pref.from, pref.to);

            if (!routeMap.has(routeKey)) {
                routeMap.set(routeKey, {
                    from: {
                        coordinates: pref.from,
                    },
                    to: {
                        coordinates: pref.to,
                    },
                    preferences: [],
                });
            }

            routeMap.get(routeKey)!.preferences.push({
                id: pref.id,
                prompt: pref.prompt,
                created_at: pref.created_at,
                updated_at: pref.updated_at,
            });
        }

        // Add location names and return
        const result: RoutePreferences[] = [];
        for (const route of routeMap.values()) {
            const fromName = await locationService.reverseGeocodeAsync(
                route.from.coordinates.latitude,
                route.from.coordinates.longitude
            );
            const toName = await locationService.reverseGeocodeAsync(
                route.to.coordinates.latitude,
                route.to.coordinates.longitude
            );

            result.push({
                from: {
                    coordinates: route.from.coordinates,
                    name: fromName,
                },
                to: {
                    coordinates: route.to.coordinates,
                    name: toName,
                },
                preferences: route.preferences,
            });
        }

        return result;
    },

    async addRoutePreference(
        from: Coordinates,
        to: Coordinates,
        prompt: string
    ): Promise<Preference> {
        const createData = RoutePreferenceCreateSchema.parse({
            prompt,
            from_latitude: from.latitude,
            from_longitude: from.longitude,
            to_latitude: to.latitude,
            to_longitude: to.longitude,
        });

        const response = await apiClient.post<RoutePreferenceResponse>(
            "/users/route-preferences",
            createData,
            {},
            RoutePreferenceResponseSchema
        );

        // Return as regular preference (the route info is just for grouping)
        return {
            id: response.id,
            prompt: response.prompt,
            created_at: response.created_at,
            updated_at: response.updated_at,
        };
    },

    async deleteRoutePreference(preferenceId: number): Promise<void> {
        await apiClient.delete<void>(
            `/users/route-preferences/${preferenceId}`
        );
    },
};

export default preferencesApi;
