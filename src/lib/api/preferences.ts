import { locationService } from "../location";

import z from "zod";

import apiClient from "./client";

interface RouteData {
    fromLat: number;
    fromLon: number;
    toLat: number;
    toLon: number;
}

export interface Route extends RouteData {
    from: string | null;
    to: string | null;
}

const getRouteKey = (route: RouteData) =>
    `${route.fromLat},${route.fromLon},${route.toLat},${route.toLon}`;

const exactum = locationService.geocodeSync("Exactum")!;
const kamppi = locationService.geocodeSync("Kamppi")!;
const pasila = locationService.geocodeSync("Pasila")!;
const helsinki = locationService.geocodeSync("Helsinki")!;
const espoo = locationService.geocodeSync("Espoo")!;

// Mocked initial routes, in a real app this might come from a different source
const initialRoutesData: RouteData[] = [
    {
        fromLat: exactum.lat,
        fromLon: exactum.lon,
        toLat: kamppi.lat,
        toLon: kamppi.lon,
    },
    {
        fromLat: kamppi.lat,
        fromLon: kamppi.lon,
        toLat: pasila.lat,
        toLon: pasila.lon,
    },
];

let savedRoutesData: RouteData[] = [...initialRoutesData];

const PreferenceSchema = z.object({
    id: z.number(),
    prompt: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime().nullable().optional(),
});

const PreferencesResponseSchema = z.array(PreferenceSchema);

export type Preference = z.infer<typeof PreferenceSchema>;

export type PreferenceCreate = Omit<
    Preference,
    "id" | "created_at" | "updated_at"
>;

const RoutePreferenceSchema = z.object({
    id: z.number(),
    prompt: z.string(),
    from_latitude: z.number().min(-90).max(90),
    from_longitude: z.number().min(-180).max(180),
    to_latitude: z.number().min(-90).max(90),
    to_longitude: z.number().min(-180).max(180),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime().nullable().optional(),
});

export type RoutePreference = z.infer<typeof RoutePreferenceSchema>;

export interface RouteWithPreferences {
    route: Route;
    preferences: RoutePreference[];
}

const initialMockRoutePreferences: { [key: string]: RoutePreference[] } = {
    [getRouteKey(initialRoutesData[0])]: [
        {
            id: 1,
            prompt: "Prefer bus 506",
            from_latitude: helsinki.lat,
            from_longitude: helsinki.lon,
            to_latitude: espoo.lat,
            to_longitude: espoo.lon,
            created_at: new Date().toISOString(),
            updated_at: null,
        },
        {
            id: 2,
            prompt: "Never use the tram for this route",
            from_latitude: helsinki.lat,
            from_longitude: helsinki.lon,
            to_latitude: espoo.lat,
            to_longitude: espoo.lon,
            created_at: new Date().toISOString(),
            updated_at: null,
        },
        {
            id: 3,
            prompt: "Avoid rush hour metro",
            from_latitude: helsinki.lat,
            from_longitude: helsinki.lon,
            to_latitude: espoo.lat,
            to_longitude: espoo.lon,
            created_at: new Date().toISOString(),
            updated_at: null,
        },
    ],
    [getRouteKey(initialRoutesData[1])]: [
        {
            id: 4,
            prompt: "Always use metro when available",
            from_latitude: helsinki.lat,
            from_longitude: helsinki.lon,
            to_latitude: pasila.lat,
            to_longitude: pasila.lon,
            created_at: new Date().toISOString(),
            updated_at: null,
        },
        {
            id: 5,
            prompt: "Avoid walking through Töölö",
            from_latitude: helsinki.lat,
            from_longitude: helsinki.lon,
            to_latitude: pasila.lat,
            to_longitude: pasila.lon,
            created_at: new Date().toISOString(),
            updated_at: null,
        },
    ],
};

// Use a deep copy for the mutable state
let mockRoutePreferences: Record<string, RoutePreference[]> = JSON.parse(
    JSON.stringify(initialMockRoutePreferences)
);
let nextId = 100;

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

    async getRoutesWithPreferences(): Promise<RouteWithPreferences[]> {
        const resolvedRoutes: Route[] = await Promise.all(
            savedRoutesData.map(async (routeData) => {
                const fromName = await locationService.reverseGeocodeAsync(
                    routeData.fromLat,
                    routeData.fromLon
                );
                const toName = await locationService.reverseGeocodeAsync(
                    routeData.toLat,
                    routeData.toLon
                );
                return {
                    ...routeData,
                    from: fromName,
                    to: toName,
                };
            })
        );

        const routesWithPreferences = resolvedRoutes.map((route) => ({
            route,
            preferences: mockRoutePreferences[getRouteKey(route)] || [],
        }));

        return Promise.resolve(routesWithPreferences);
    },

    async addRouteSpecificPreference(
        route: RouteData,
        preference: PreferenceCreate
    ): Promise<RoutePreference> {
        const routeKey = getRouteKey(route);
        console.log(
            `Adding preference to route ${routeKey}: ${preference.prompt}`
        );
        const newPreference: RoutePreference = {
            id: nextId++, // Incrementing ID to ensure uniqueness
            ...preference,
            prompt: preference.prompt,
            from_latitude: espoo.lat,
            from_longitude: espoo.lon,
            to_latitude: helsinki.lat,
            to_longitude: helsinki.lon,
            created_at: new Date().toISOString(),
            updated_at: null,
        };
        const existingPrefs = mockRoutePreferences[routeKey] || [];
        mockRoutePreferences[routeKey] = [...existingPrefs, newPreference];
        return Promise.resolve(newPreference);
    },

    async deleteRouteSpecificPreference(
        route: RouteData,
        preferenceId: number
    ): Promise<void> {
        const routeKey = getRouteKey(route);
        console.log(
            `Deleting preference ${preferenceId} from route ${routeKey}`
        );
        if (mockRoutePreferences[routeKey]) {
            mockRoutePreferences[routeKey] = mockRoutePreferences[
                routeKey
            ].filter((p) => p.id !== preferenceId);
        }
        return Promise.resolve();
    },

    addSavedRoute: async (from: string, to: string): Promise<void> => {
        const fromCoords = await locationService.geocode(from);
        const toCoords = await locationService.geocode(to);

        if (!fromCoords || !toCoords) {
            console.warn("Could not find coordinates for one of the locations");
            return;
        }

        const newRouteData: RouteData = {
            fromLat: fromCoords.lat,
            fromLon: fromCoords.lon,
            toLat: toCoords.lat,
            toLon: toCoords.lon,
        };

        const routeKey = getRouteKey(newRouteData);
        const routeExists = savedRoutesData.some(
            (route) => getRouteKey(route) === routeKey
        );

        if (routeExists) {
            return;
        }

        savedRoutesData.push(newRouteData);
        mockRoutePreferences[routeKey] = [];
    },

    // Test helper to reset the mock state
    __resetMocks: () => {
        mockRoutePreferences = JSON.parse(
            JSON.stringify(initialMockRoutePreferences)
        );
        savedRoutesData = [...initialRoutesData];
        nextId = 100;
    },
};

export default preferencesApi;
