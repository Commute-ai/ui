import React, { type ReactNode } from "react";

import { act, renderHook } from "@testing-library/react-native";

import { routingApi } from "@/lib/api/routing";

import { AuthContext } from "@/context/AuthContext";
import {
    RouteSearchProvider,
    useRouteSearch,
} from "@/context/RouteSearchContext";
import { ApiError } from "@/types/api";
import { type Itinerary } from "@/types/itinary";

// Mock the routesApi
jest.mock("@/lib/api/routing");
const mockedRoutingApi = routingApi as jest.Mocked<typeof routingApi>;

const mockItineraries: Itinerary[] = [
    {
        legs: [],
        duration: 60,
        walk_distance: 10,
        walk_time: 10,
        start: new Date("2023-01-01T10:00:00Z"),
        end: new Date("2023-01-01T11:00:00Z"),
    },
    {
        legs: [],
        duration: 75,
        walk_distance: 12,
        walk_time: 15,
        start: new Date("2023-01-01T12:00:00Z"),
        end: new Date("2023-01-01T14:00:00Z"),
    },
];

// Custom wrapper to provide both AuthContext and RouteSearchProvider
const createWrapper = (authContextValue: any) => {
    return function wrapper({ children }: { children: ReactNode }) {
        return (
            <AuthContext.Provider value={authContextValue}>
                <RouteSearchProvider>{children}</RouteSearchProvider>
            </AuthContext.Provider>
        );
    };
};

describe("useRouteSearch", () => {
    // Default mock for a logged-in user with a valid token
    const defaultAuthContext = {
        getToken: jest.fn().mockResolvedValue("fake-token"),
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it("throws an error when used outside of a RouteSearchProvider", () => {
        const consoleError = console.error;
        console.error = jest.fn(); // Suppress expected error log

        expect(() => renderHook(() => useRouteSearch())).toThrow(
            "useRouteSearch must be used within a RouteSearchProvider"
        );

        console.error = consoleError; // Restore console.error
    });

    it("initializes with default values", () => {
        const { result } = renderHook(() => useRouteSearch(), {
            wrapper: createWrapper(defaultAuthContext),
        });

        expect(result.current.routes).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it("searches for routes successfully and updates state", async () => {
        mockedRoutingApi.searchRoutes.mockResolvedValue(mockItineraries);

        const { result } = renderHook(() => useRouteSearch(), {
            wrapper: createWrapper(defaultAuthContext),
        });

        await act(async () => {
            result.current.searchRoutes("Helsinki", "Tampere");
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.routes).toEqual(mockItineraries);
        expect(result.current.error).toBeNull();
        expect(mockedRoutingApi.searchRoutes).toHaveBeenCalledWith(
            "Helsinki",
            "Tampere"
        );
    });

    it("handles API errors correctly", async () => {
        const apiError = new ApiError(
            "The server is down",
            "SERVICE_UNAVAILABLE"
        );
        mockedRoutingApi.searchRoutes.mockRejectedValue(apiError);

        const { result } = renderHook(() => useRouteSearch(), {
            wrapper: createWrapper(defaultAuthContext),
        });

        await act(async () => {
            result.current.searchRoutes("Helsinki", "Tampere");
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.routes).toEqual([]);
        expect(result.current.error).toBe("The server is down");
    });

    it("handles unknown place errors specifically", async () => {
        const unknownPlaceError = new Error(
            "Unknown origin or destination: Atlantis"
        );
        mockedRoutingApi.searchRoutes.mockRejectedValue(unknownPlaceError);

        const { result } = renderHook(() => useRouteSearch(), {
            wrapper: createWrapper(defaultAuthContext),
        });

        await act(async () => {
            result.current.searchRoutes("Atlantis", "El Dorado");
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(
            `Unknown place: "Atlantis". Please select a place from the suggestions.`
        );
    });

    it("handles generic errors", async () => {
        const genericError = new Error("Something went wrong");
        mockedRoutingApi.searchRoutes.mockRejectedValue(genericError);

        const { result } = renderHook(() => useRouteSearch(), {
            wrapper: createWrapper(defaultAuthContext),
        });

        await act(async () => {
            result.current.searchRoutes("From", "To");
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(
            "An unexpected error occurred while searching for routes."
        );
    });

    it("handles the case where the auth token is not available", async () => {
        const authContextWithoutToken = {
            getToken: jest.fn().mockResolvedValue(null),
        };

        const { result } = renderHook(() => useRouteSearch(), {
            wrapper: createWrapper(authContextWithoutToken),
        });

        await act(async () => {
            result.current.searchRoutes("From", "To");
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(
            "Authentication token is not available."
        );
        expect(mockedRoutingApi.searchRoutes).not.toHaveBeenCalled();
    });

    it("clears the search results and error", async () => {
        mockedRoutingApi.searchRoutes.mockResolvedValue(mockItineraries);

        const { result } = renderHook(() => useRouteSearch(), {
            wrapper: createWrapper(defaultAuthContext),
        });

        // Search to populate state
        await act(async () => {
            result.current.searchRoutes("From", "To");
        });

        // Verify state is populated
        expect(result.current.routes.length).toBeGreaterThan(0);

        // Clear the search
        act(() => {
            result.current.clearSearch();
        });

        // Verify state is cleared
        expect(result.current.routes).toEqual([]);
        expect(result.current.error).toBeNull();
    });
});
