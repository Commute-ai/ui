import { z } from "zod";

import { PlaceSchema } from "./location";

const TransportModeSchema = z.enum([
    "WALK",
    "BICYCLE",
    "CAR",
    "TRAM",
    "SUBWAY",
    "RAIL",
    "BUS",
    "FERRY",
]);

const RouteSchema = z.object({
    short_name: z.string(),
    long_name: z.string(),
    description: z.string().nullable().optional(),
});

export const LegSchema = z.object({
    mode: TransportModeSchema,
    start: z.coerce.date(),
    end: z.coerce.date(),
    duration: z.number(),
    distance: z.number(),
    from_place: PlaceSchema,
    to_place: PlaceSchema,
    route: RouteSchema.nullable().optional(),
});

export const ItinerarySchema = z.object({
    start: z.coerce.date(),
    end: z.coerce.date(),
    duration: z.number(),
    walk_distance: z.number(),
    walk_time: z.number(),
    legs: z.array(LegSchema),
});

export type Place = z.infer<typeof PlaceSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type Leg = z.infer<typeof LegSchema>;
export type Itinerary = z.infer<typeof ItinerarySchema>;
