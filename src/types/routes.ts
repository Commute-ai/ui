import { z } from "zod";

// Corresponds to the backend's Coordinates schema.
const CoordinatesSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

// Corresponds to the backend's Place schema, which has a nested Coordinates object.
const PlaceSchema = z.object({
    name: z.string(),
    coordinates: CoordinatesSchema,
});

// Corresponds to the backend's Route schema.
const RouteInfoSchema = z.object({
    short_name: z.string(),
    long_name: z.string(),
    description: z.string().nullable(),
});

// Corresponds to the backend's TransportMode enum.
const TransportModeEnum = z.enum([
    "WALK",
    "BICYCLE",
    "CAR",
    "TRAM",
    "SUBWAY",
    "RAIL",
    "BUS",
    "FERRY",
]);

// Corresponds to the backend's Leg schema.
export const RouteLegSchema = z.object({
    mode: TransportModeEnum,
    start: z.string(), // Pydantic datetime becomes ISO string in JSON
    end: z.string(),
    duration: z.number(),
    distance: z.number(),
    from_place: PlaceSchema,
    to_place: PlaceSchema,
    route: RouteInfoSchema.nullable().optional(),
});

// Corresponds to the backend's Itinerary schema.
export const ItinerarySchema = z.object({
    start: z.string(), // Pydantic datetime becomes ISO string in JSON
    end: z.string(),
    duration: z.number(),
    walk_distance: z.number(),
    walk_time: z.number(),
    legs: z.array(RouteLegSchema),
});

// The overall response from the /routes/search endpoint.
// The origin/destination are of type Coordinates directly.
export const RouteSearchResponseSchema = z.object({
    origin: CoordinatesSchema,
    destination: CoordinatesSchema,
    itineraries: z.array(ItinerarySchema),
    search_time: z.string(), // Pydantic datetime becomes ISO string in JSON
});

export type Place = z.infer<typeof PlaceSchema>;
export type RouteInfo = z.infer<typeof RouteInfoSchema>;
export type RouteLeg = z.infer<typeof RouteLegSchema>;
export type Itinerary = z.infer<typeof ItinerarySchema>;
export type RouteSearchResponse = z.infer<typeof RouteSearchResponseSchema>;

// The existing Route type is identical to Itinerary, so we can keep it for compatibility
export type Route = Itinerary;
