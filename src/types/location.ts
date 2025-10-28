import { z } from "zod";

import { CoordinatesSchema } from "./geo";

export const PlaceSchema = z.object({
    coordinates: CoordinatesSchema,
    name: z.string().nullable().optional(),
});

export type Place = z.infer<typeof PlaceSchema>;
