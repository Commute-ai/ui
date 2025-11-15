/**
 * Location service for managing place suggestions and location-related functionality.
 * This service provides a centralized interface for location operations and can be
 * easily extended to integrate with real geo services in the future.
 */
import type { Place } from "../types/location";

// Re-export Place type for backward compatibility
export type { Place };

export interface LocationService {
    /**
     * Get place suggestions based on a query string
     */
    getSuggestions(query: string): Promise<Place[]>;

    /**
     * Get the user's current location (placeholder for future implementation)
     */
    getCurrentLocation(): Promise<Place | null>;

    /**
     * Validate if a place name is a valid location
     */
    isValidPlace(placeName: string): boolean;

    /**
     * Get all available places (for testing/development)
     */
    getAllPlaces(): Place[];

    /**
     * Get a place by its name
     */
    reverseGeocodeSync(name: string): Place | undefined;

    /**
     * Geocode a name to a location (async)
     */
    geocode(name: string): Promise<{ lat: number; lon: number } | null>;

    /**
     * Geocode a name to a location (sync)
     */
    geocodeSync(name: string): { lat: number; lon: number } | null;

    /**
     * Reverse geocode a location to its name
     */
    reverseGeocodeAsync(lat: number, lon: number): Promise<string>;
}

// Hardcoded places for development - will be replaced with real geo service
const HELSINKI_PLACES: Place[] = [
    { coordinates: { latitude: 60.169, longitude: 24.932 }, name: "Kamppi" },
    { coordinates: { latitude: 60.184, longitude: 24.95 }, name: "Kallio" },
    { coordinates: { latitude: 60.158, longitude: 24.913 }, name: "Eira" },
    { coordinates: { latitude: 60.17, longitude: 24.938 }, name: "Helsinki" },
    { coordinates: { latitude: 60.205, longitude: 24.656 }, name: "Espoo" },
    { coordinates: { latitude: 60.294, longitude: 25.04 }, name: "Vantaa" },
    {
        coordinates: { latitude: 60.211, longitude: 24.729 },
        name: "Kauniainen",
    },
    {
        coordinates: { latitude: 60.17, longitude: 24.951 },
        name: "Helsingin Yliopisto",
    },
    {
        coordinates: { latitude: 60.171, longitude: 24.944 },
        name: "Rautatatientori",
    },
    { coordinates: { latitude: 60.199, longitude: 24.934 }, name: "Pasila" },
    { coordinates: { latitude: 60.204, longitude: 24.962 }, name: "Exactum" },
];

class HardcodedLocationService implements LocationService {
    private places: Place[] = HELSINKI_PLACES;

    async getSuggestions(query: string): Promise<Place[]> {
        if (!query.trim()) {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();

        return this.places.filter((place) =>
            place.name?.toLowerCase().startsWith(normalizedQuery)
        );
    }

    async getCurrentLocation(): Promise<Place | null> {
        // For now, return Kamppi as the default "current location"
        // In the future, this would use actual geolocation services
        return this.reverseGeocodeSync("Kamppi");
    }

    isValidPlace(placeName: string): boolean {
        return this.places.some((place) => place.name === placeName);
    }

    getAllPlaces(): Place[] {
        return [...this.places];
    }

    reverseGeocodeSync(name: string): Place | undefined {
        return this.places.find((p) => p.name === name);
    }

    async geocode(name: string): Promise<{ lat: number; lon: number } | null> {
        return this.geocodeSync(name);
    }

    geocodeSync(name: string): { lat: number; lon: number } | null {
        const place = this.reverseGeocodeSync(name);
        if (place) {
            return {
                lat: place.coordinates.latitude,
                lon: place.coordinates.longitude,
            };
        }
        return null;
    }

    async reverseGeocodeAsync(lat: number, lon: number): Promise<string> {
        const place = this.places.find(
            (p) =>
                p.coordinates.latitude === lat &&
                p.coordinates.longitude === lon
        );
        return place ? place.name : "Unknown Location";
    }
}

// Export a singleton instance
export const locationService: LocationService = new HardcodedLocationService();

// Export hardcoded places for backward compatibility during migration
export const HARDCODED_PLACES = HELSINKI_PLACES.map((place) => place.name);

/**
 * Hook for using location service in React components
 */
export const useLocationService = () => {
    return {
        getSuggestions: locationService.getSuggestions.bind(locationService),
        getCurrentLocation:
            locationService.getCurrentLocation.bind(locationService),
        isValidPlace: locationService.isValidPlace.bind(locationService),
        getAllPlaces: locationService.getAllPlaces.bind(locationService),
        reverseGeocodeSync:
            locationService.reverseGeocodeSync.bind(locationService),
        geocode: locationService.geocode.bind(locationService),
        geocodeSync: locationService.geocodeSync.bind(locationService),
        reverseGeocodeAsync:
            locationService.reverseGeocodeAsync.bind(locationService),
    };
};
