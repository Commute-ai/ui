import { z } from "zod";

import apiClient from "./client";
import { Itinerary, RouteSearchResponseSchema } from "@/types/routes";

// Corresponds to the backend's Coordinates schema
const CoordinatesSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;

// Corresponds to the backend's RouteSearchRequest schema
const RouteSearchRequestSchema = z.object({
    origin: CoordinatesSchema,
    destination: CoordinatesSchema,
    num_itineraries: z.number().optional(),
    earliest_departure: z.string().datetime().optional(),
});

export type RouteSearchRequest = z.infer<typeof RouteSearchRequestSchema>;

const placeCoordinates: Record<string, Coordinates> = {
    kamppi: { latitude: 60.1686, longitude: 24.9326 },
    kallio: { latitude: 60.181, longitude: 24.95 },
    eira: { latitude: 60.158, longitude: 24.94 },
    helsinki: { latitude: 60.1699, longitude: 24.9384 },
    espoo: { latitude: 60.205, longitude: 24.656 },
    vantaa: { latitude: 60.294, longitude: 25.04 },
    kauniainen: { latitude: 60.212, longitude: 24.728 },
    "helsingin yliopisto": { latitude: 60.169, longitude: 24.95 },
    rautatatientori: { latitude: 60.171, longitude: 24.941 },
    pasila: { latitude: 60.2055, longitude: 24.9625 },
    center: { latitude: 60.1699, longitude: 24.9384 }, // Helsinki Centre
};

export const routesApi = {
    searchRoutes: async (
        origin: string,
        destination: string,
        token: string
    ): Promise<Itinerary[]> => {
        const originCoords = placeCoordinates[origin.toLowerCase()];
        const destinationCoords = placeCoordinates[destination.toLowerCase()];

        if (!originCoords || !destinationCoords) {
            // TODO: Better error handling
            throw new Error(
                `Unknown origin or destination: ${!originCoords ? origin : destination}`
            );
        }

        const requestBody: RouteSearchRequest = {
            origin: originCoords,
            destination: destinationCoords,
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
