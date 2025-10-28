import apiClient from "@/lib/api/client";
import { routingApi } from "@/lib/api/routing";

import { Itinerary } from "@/types/itinary";

jest.mock("@/lib/api/client");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("routingApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return itineraries for a successful search", async () => {
        const mockItineraries: Itinerary[] = [
            {
                start: new Date("2024-01-01T10:00:00Z"),
                end: new Date("2024-01-01T10:30:00Z"),
                legs: [],
                duration: 100,
                walk_distance: 50,
                walk_time: 20,
            },
        ];

        mockedApiClient.post.mockResolvedValue({
            itineraries: mockItineraries,
        });

        const result = await routingApi.searchRoutes("kamppi", "kallio");

        expect(result).toEqual(mockItineraries);
        expect(mockedApiClient.post).toHaveBeenCalledWith(
            "/routes/search",
            expect.any(Object),
            {},
            expect.any(Object)
        );
    });

    it("should throw an error for an unknown origin", async () => {
        await expect(
            routingApi.searchRoutes("unknown", "kallio")
        ).rejects.toThrow("Unknown origin or destination: unknown");
    });

    it("should throw an error for an unknown destination", async () => {
        await expect(
            routingApi.searchRoutes("kamppi", "unknown")
        ).rejects.toThrow("Unknown origin or destination: unknown");
    });
});
