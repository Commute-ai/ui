import apiClient from "@/lib/api/client";
import { routesApi } from "@/lib/api/routes";

import { Itinerary } from "@/types/routes";

jest.mock("@/lib/api/client");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("routesApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return itineraries for a successful search", async () => {
        const mockItineraries: Itinerary[] = [
            {
                legs: [],
                duration: 100,
                startTime: 100,
                endTime: 200,
                walkDistance: 50,
            },
        ];

        mockedApiClient.post.mockResolvedValue({
            itineraries: mockItineraries,
        });

        const result = await routesApi.searchRoutes(
            "kamppi",
            "kallio",
            "test-token"
        );

        expect(result).toEqual(mockItineraries);
        expect(mockedApiClient.post).toHaveBeenCalledWith(
            "/routes/search",
            expect.any(Object),
            {
                headers: {
                    Authorization: "Bearer test-token",
                },
            },
            expect.any(Object)
        );
    });

    it("should throw an error for an unknown origin", async () => {
        await expect(
            routesApi.searchRoutes("unknown", "kallio", "test-token")
        ).rejects.toThrow("Unknown origin or destination: unknown");
    });

    it("should throw an error for an unknown destination", async () => {
        await expect(
            routesApi.searchRoutes("kamppi", "unknown", "test-token")
        ).rejects.toThrow("Unknown origin or destination: unknown");
    });
});
