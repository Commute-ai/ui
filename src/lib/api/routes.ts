import { z } from "zod";
import apiClient from "./client";
import { Itinerary, RouteSearchResponseSchema } from "@/types/routes";

// Corresponds to the backend's Coordinates schema
const CoordinatesSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

// Corresponds to the backend's RouteSearchRequest schema
const RouteSearchRequestSchema = z.object({
    origin: CoordinatesSchema,
    destination: CoordinatesSchema,
    num_itineraries: z.number().optional(),
    earliest_departure: z.string().datetime().optional(),
});

export type RouteSearchRequest = z.infer<typeof RouteSearchRequestSchema>;

export const routesApi = {
    searchRoutes: async (
        // The string arguments from the UI are currently ignored.
        origin: string,
        destination: string,
        token: string
    ): Promise<Itinerary[]> => {
        // TODO: Implement geocoding to convert string origin/destination to coordinates.
        const requestBody: RouteSearchRequest = {
            origin: { latitude: 60.1699, longitude: 24.9384 }, // Hardcoded: Helsinki Centre
            destination: { latitude: 60.2055, longitude: 24.9625 }, // Hardcoded: Pasila Station
            num_itineraries: 5,
            earliest_departure: new Date().toISOString(),
        };

        const response = await apiClient.post(
            "/routes/search",
            requestBody,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            RouteSearchResponseSchema
        );
        return response.itineraries;
    },
};
