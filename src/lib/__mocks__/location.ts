import { LocationService, Place } from "../location";

const MOCK_PLACES: Place[] = [
    { coordinates: { latitude: 60.169, longitude: 24.932 }, name: "Kamppi" },
    { coordinates: { latitude: 60.184, longitude: 24.95 }, name: "Kallio" },
    { coordinates: { latitude: 60.158, longitude: 24.913 }, name: "Eira" },
    { coordinates: { latitude: 60.17, longitude: 24.938 }, name: "Helsinki" },
    {
        coordinates: { latitude: 60.17, longitude: 24.951 },
        name: "Helsingin Yliopisto",
    },
    { coordinates: { latitude: 60.204, longitude: 24.962 }, name: "Exactum" },
];

export const mockLocationService: LocationService = {
    async getSuggestions(query: string): Promise<Place[]> {
        if (!query.trim()) {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();
        return MOCK_PLACES.filter((place) =>
            place.name?.toLowerCase().startsWith(normalizedQuery)
        );
    },

    async getCurrentLocation(): Promise<Place | null> {
        return MOCK_PLACES.find((place) => place.name === "Kamppi") || null;
    },

    isValidPlace(placeName: string): boolean {
        return MOCK_PLACES.some((place) => place.name === placeName);
    },

    getAllPlaces(): Place[] {
        return [...MOCK_PLACES];
    },
};

export const useLocationService = () => ({
    getSuggestions:
        mockLocationService.getSuggestions.bind(mockLocationService),
    getCurrentLocation:
        mockLocationService.getCurrentLocation.bind(mockLocationService),
    isValidPlace: mockLocationService.isValidPlace.bind(mockLocationService),
    getAllPlaces: mockLocationService.getAllPlaces.bind(mockLocationService),
});

export const HARDCODED_PLACES = MOCK_PLACES.map((place) => place.name);
