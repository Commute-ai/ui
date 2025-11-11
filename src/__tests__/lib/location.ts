import { locationService } from "@/lib/location";

describe("Location Service", () => {
    describe("getSuggestions", () => {
        it("returns suggestions for valid partial input", async () => {
            const suggestions = await locationService.getSuggestions("Hel");
            expect(suggestions).toHaveLength(2);
            expect(suggestions.map((s) => s.name)).toEqual([
                "Helsinki",
                "Helsingin Yliopisto",
            ]);
        });

        it("returns empty array for empty input", async () => {
            const suggestions = await locationService.getSuggestions("");
            expect(suggestions).toEqual([]);
        });

        it("returns empty array for whitespace input", async () => {
            const suggestions = await locationService.getSuggestions("   ");
            expect(suggestions).toEqual([]);
        });

        it("returns case-insensitive matches", async () => {
            const suggestions = await locationService.getSuggestions("hel");
            expect(suggestions).toHaveLength(2);
            expect(suggestions.map((s) => s.name)).toEqual([
                "Helsinki",
                "Helsingin Yliopisto",
            ]);
        });
    });

    describe("getCurrentLocation", () => {
        it("returns Kamppi as current location", async () => {
            const location = await locationService.getCurrentLocation();
            expect(location).toBeDefined();
            expect(location?.name).toBe("Kamppi");
        });
    });

    describe("isValidPlace", () => {
        it("returns true for valid place names", () => {
            expect(locationService.isValidPlace("Helsinki")).toBe(true);
            expect(locationService.isValidPlace("Kamppi")).toBe(true);
            expect(locationService.isValidPlace("Exactum")).toBe(true);
        });

        it("returns false for invalid place names", () => {
            expect(locationService.isValidPlace("Invalid Place")).toBe(false);
            expect(locationService.isValidPlace("")).toBe(false);
        });
    });

    describe("getAllPlaces", () => {
        it("returns all available places", () => {
            const places = locationService.getAllPlaces();
            expect(places.length).toBeGreaterThan(0);
            expect(
                places.every((place) => place.name && place.coordinates)
            ).toBe(true);
        });
    });
});
