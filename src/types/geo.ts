import { z } from "zod";

export const CoordinatesSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;
