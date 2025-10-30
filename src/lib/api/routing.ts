import z from "zod";

import apiClient from "./client";
import { CoordinatesSchema } from "@/types/geo";
import { Itinerary, ItinerarySchema } from "@/types/itinerary";
import { Place } from "@/types/location";

const places: Place[] = [
    { name: "Kamppi", coordinates: { latitude: 60.1686, longitude: 24.9326 } },
    { name: "Kallio", coordinates: { latitude: 60.181, longitude: 24.95 } },
    { name: "Eira", coordinates: { latitude: 60.158, longitude: 24.94 } },
    {
        name: "Helsinki",
        coordinates: { latitude: 60.1699, longitude: 24.9384 },
    },
    { name: "Espoo", coordinates: { latitude: 60.205, longitude: 24.656 } },
    { name: "Vantaa", coordinates: { latitude: 60.294, longitude: 25.04 } },
    {
        name: "Kauniainen",
        coordinates: { latitude: 60.212, longitude: 24.728 },
    },
    {
        name: "Helsingin Yliopisto",
        coordinates: { latitude: 60.169, longitude: 24.95 },
    },
    {
        name: "Rautatientori",
        coordinates: { latitude: 60.171, longitude: 24.941 },
    },
    { name: "Pasila", coordinates: { latitude: 60.2055, longitude: 24.9625 } },
    { name: "Center", coordinates: { latitude: 60.1699, longitude: 24.9384 } }, // Helsinki Centre
];

const RouteSearchRequestSchema = z.object({
    origin: CoordinatesSchema,
    destination: CoordinatesSchema,
    earliest_departure: z.string().optional(), // ISO datetime string
    num_itineraries: z.number().min(1).max(10).optional(),
});

const RouteSearchResponseSchema = z.object({
    origin: CoordinatesSchema,
    destination: CoordinatesSchema,
    itineraries: z.array(ItinerarySchema),
    search_time: z.string(),
});

// A simple feature toggle for mocking AI insights
const MOCK_AI_INSIGHTS = false;

export const routingApi = {
    searchRoutes: async (
        origin_name: string,
        destination_name: string
    ): Promise<Itinerary[]> => {
        const origin = places.find(
            (place) => place.name?.toLowerCase() === origin_name.toLowerCase()
        );
        const destination = places.find(
            (place) =>
                place.name?.toLowerCase() === destination_name.toLowerCase()
        );

        if (!origin || !destination) {
            // TODO: Better error handling
            throw new Error(
                `Unknown origin or destination: ${!origin ? origin_name : destination_name}`
            );
        }

        const requestBody = RouteSearchRequestSchema.parse({
            origin: origin.coordinates,
            destination: destination.coordinates,
            num_itineraries: 5,
            earliest_departure: new Date().toISOString(),
        });

        const response = await apiClient.post(
            "/routes/search",
            requestBody,
            {},
            RouteSearchResponseSchema
        );

        if (MOCK_AI_INSIGHTS) {
            console.log("Mocking AI insights for development.");
            response.itineraries.forEach((itinerary) => {
                itinerary.ai_insight = `This is a mocked AI insight for the itinerary to ${destination.name}.`;
                itinerary.legs.forEach((leg) => {
                    leg.ai_insight = `Mocked AI insight for a ${leg.mode} leg.`;
                });
            });
        }

        return response.itineraries;
    },
};
