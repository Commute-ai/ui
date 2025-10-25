import { z } from "zod";

export const RouteLegSchema = z.object({
    mode: z.enum(["walk", "bus", "tram", "metro"]),
    line: z.string().optional(),
    duration: z.number(),
    distance: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
});

export const ItinerarySchema = z.object({
    id: z.number(),
    departureTime: z.string(),
    arrivalTime: z.string(),
    duration: z.number(),
    legs: z.array(RouteLegSchema),
    aiMatch: z.number(),
    aiReason: z.string(),
});

export const RouteSearchResponseSchema = z.object({
    origin: z.string(),
    destination: z.string(),
    itineraries: z.array(ItinerarySchema),
    search_time: z.string(),
});

export type RouteLeg = z.infer<typeof RouteLegSchema>;
export type Itinerary = z.infer<typeof ItinerarySchema>;
export type RouteSearchResponse = z.infer<typeof RouteSearchResponseSchema>;

// The existing Route type is identical to Itinerary, so we can keep it for compatibility
export type Route = Itinerary;
