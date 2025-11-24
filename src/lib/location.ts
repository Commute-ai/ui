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
    reverseGeocodeAsync(lat: number, lon: number): Promise<string | null>;
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
    {
        coordinates: { latitude: 60.145, longitude: 24.985 },
        name: "Suomenlinna",
    },
    {
        coordinates: { latitude: 60.188, longitude: 24.942 },
        name: "Linnanmäki",
    },
    { coordinates: { latitude: 60.177, longitude: 24.915 }, name: "Töölö" },
    { coordinates: { latitude: 60.16, longitude: 24.938 }, name: "Punavuori" },
    { coordinates: { latitude: 60.191, longitude: 24.945 }, name: "Alppila" },
    { coordinates: { latitude: 60.203, longitude: 24.965 }, name: "Kumpula" },
    { coordinates: { latitude: 60.173, longitude: 24.938 }, name: "Oodi" },
    {
        coordinates: { latitude: 60.172, longitude: 24.925 },
        name: "Temppeliaukion kirkko",
    },
    { coordinates: { latitude: 60.167, longitude: 24.945 }, name: "Esplanadi" },
    { coordinates: { latitude: 60.179, longitude: 24.952 }, name: "Hakaniemi" },
    {
        coordinates: { latitude: 60.184, longitude: 24.887 },
        name: "Seurasaari",
    },
    {
        coordinates: { latitude: 60.158, longitude: 24.956 },
        name: "Kaivopuisto",
    },
    {
        coordinates: { latitude: 60.168, longitude: 24.96 },
        name: "Uspenskin katedraali",
    },
    { coordinates: { latitude: 60.17, longitude: 24.945 }, name: "Ateneum" },
    { coordinates: { latitude: 60.172, longitude: 24.935 }, name: "Kiasma" },
    { coordinates: { latitude: 60.16, longitude: 24.87 }, name: "Lauttasaari" },
    { coordinates: { latitude: 60.196, longitude: 24.96 }, name: "Vallila" },
    {
        coordinates: { latitude: 60.21, longitude: 24.978 },
        name: "Arabianranta",
    },
    {
        coordinates: { latitude: 60.198, longitude: 24.869 },
        name: "Munkkiniemi",
    },
    { coordinates: { latitude: 60.223, longitude: 24.895 }, name: "Haaga" },
    { coordinates: { latitude: 60.224, longitude: 25.077 }, name: "Itäkeskus" },
    { coordinates: { latitude: 60.239, longitude: 25.085 }, name: "Kontula" },
    { coordinates: { latitude: 60.252, longitude: 25.021 }, name: "Malmi" },
    {
        coordinates: { latitude: 60.174, longitude: 24.931 },
        name: "Finlandia-talo",
    },
    {
        coordinates: { latitude: 60.173, longitude: 24.933 },
        name: "Musiikkitalo",
    },
    {
        coordinates: { latitude: 60.175, longitude: 24.932 },
        name: "Kansallismuseo",
    },
    {
        coordinates: { latitude: 60.187, longitude: 24.927 },
        name: "Olympiastadion",
    },
    {
        coordinates: { latitude: 60.163, longitude: 24.915 },
        name: "Ruoholahti",
    },
    {
        coordinates: { latitude: 60.155, longitude: 24.917 },
        name: "Jätkäsaari",
    },
    {
        coordinates: { latitude: 60.187, longitude: 24.978 },
        name: "Kalasatama",
    },
    {
        coordinates: { latitude: 60.195, longitude: 25.045 },
        name: "Herttoniemi",
    },
    { coordinates: { latitude: 60.185, longitude: 25.021 }, name: "Kulosaari" },
    { coordinates: { latitude: 60.191, longitude: 24.894 }, name: "Meilahti" },
    { coordinates: { latitude: 60.178, longitude: 25.06 }, name: "Laajasalo" },
    {
        coordinates: { latitude: 60.182, longitude: 24.913 },
        name: "Sibelius Monument",
    },
    {
        coordinates: { latitude: 60.17, longitude: 24.952 },
        name: "Helsinki Cathedral",
    },
    { coordinates: { latitude: 60.165, longitude: 24.94 }, name: "Bulevardi" },
    { coordinates: { latitude: 60.18, longitude: 24.957 }, name: "Caisa" },
    {
        coordinates: { latitude: 60.162, longitude: 24.941 },
        name: "Dianapuisto",
    },
    {
        coordinates: { latitude: 60.198, longitude: 24.845 },
        name: "Gallen-Kallelan Museo",
    },
    { coordinates: { latitude: 60.295, longitude: 24.568 }, name: "Nuuksio" },
    {
        coordinates: { latitude: 60.178, longitude: 25.045 },
        name: "Villa Wuorio",
    },
    {
        coordinates: { latitude: 60.167, longitude: 24.938 },
        name: "Yrjönkadun uimahalli",
    },
    { coordinates: { latitude: 60.26, longitude: 25.21 }, name: "Östersundom" },
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
        return this.reverseGeocodeSync("Kamppi") || null;
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

    async reverseGeocodeAsync(
        lat: number,
        lon: number
    ): Promise<string | null> {
        const place = this.places.find(
            (p) =>
                p.coordinates.latitude === lat &&
                p.coordinates.longitude === lon
        );
        return place?.name || null;
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
