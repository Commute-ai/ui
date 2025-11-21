import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import preferencesApi from "@/lib/api/preferences";

import RouteSpecificPreferences from "@/components/RouteSpecificPreferences";

import { Coordinates } from "@/types/geo";
import { Preference, RoutePreferences } from "@/types/preferences";

const getRouteKey = (from: Coordinates, to: Coordinates) =>
    `${from.latitude},${from.longitude},${to.latitude},${to.longitude}`;

// Mock data
const MOCK_ROUTES_WITH_PREFERENCES: RoutePreferences[] = [
    {
        from: {
            coordinates: { latitude: 60.204, longitude: 24.962 },
            name: "Exactum",
        },
        to: {
            coordinates: { latitude: 60.169, longitude: 24.932 },
            name: "Kamppi",
        },
        preferences: [
            {
                id: 1,
                prompt: "Prefer bus 506",
                created_at: "2023-01-01T12:00:00.000Z",
                updated_at: null,
            },
            {
                id: 2,
                prompt: "Never use the tram for this route",
                created_at: "2023-01-01T12:00:00.000Z",
                updated_at: null,
            },
            {
                id: 3,
                prompt: "Avoid rush hour metro",
                created_at: "2023-01-01T12:00:00.000Z",
                updated_at: null,
            },
        ],
    },
    {
        from: {
            coordinates: { latitude: 60.169, longitude: 24.932 },
            name: "Kamppi",
        },
        to: {
            coordinates: { latitude: 60.199, longitude: 24.934 },
            name: "Pasila",
        },
        preferences: [
            {
                id: 4,
                prompt: "Always use metro when available",
                created_at: "2023-01-01T12:00:00.000Z",
                updated_at: null,
            },
            {
                id: 5,
                prompt: "Avoid walking through Töölö",
                created_at: "2023-01-01T12:00:00.000Z",
                updated_at: null,
            },
        ],
    },
];

let mockRoutesWithPreferences: RoutePreferences[];
let mockNextPreferenceId: number;

// Mock the API module
jest.mock("@/lib/api/preferences", () => ({
    getRoutePreferences: jest.fn(async () => mockRoutesWithPreferences),
    addRoutePreference: jest.fn(
        async (from: Coordinates, to: Coordinates, prompt: string) => {
            const newPreference: Preference = {
                id: mockNextPreferenceId++,
                prompt,
                created_at: new Date().toISOString(),
                updated_at: null,
            };
            mockRoutesWithPreferences = mockRoutesWithPreferences.map((r) =>
                getRouteKey(r.from.coordinates, r.to.coordinates) ===
                getRouteKey(from, to)
                    ? { ...r, preferences: [...r.preferences, newPreference] }
                    : r
            );
            return newPreference;
        }
    ),
    deleteRoutePreference: jest.fn(async (preferenceId: number) => {
        mockRoutesWithPreferences = mockRoutesWithPreferences.map((r) => ({
            ...r,
            preferences: r.preferences.filter((p) => p.id !== preferenceId),
        }));
    }),
    addSavedRoute: jest.fn(async (from: string, to: string) => {
        const newRoute: RoutePreferences = {
            from: {
                coordinates: { latitude: 0, longitude: 0 },
                name: from,
            },
            to: {
                coordinates: { latitude: 0, longitude: 0 },
                name: to,
            },
            preferences: [],
        };
        mockRoutesWithPreferences.push(newRoute);
    }),
}));

// Mock the location service
jest.mock("@/lib/location", () => ({
    useLocationService: () => ({
        getSuggestions: jest.fn(() =>
            Promise.resolve([
                { name: "Helsinki", lat: 60.1699, lon: 24.9384 },
                { name: "Espoo", lat: 60.2055, lon: 24.6559 },
            ])
        ),
        isValidPlace: jest.fn((place: string) =>
            ["Helsinki", "Espoo", "Vantaa", "Tampere"].includes(place)
        ),
    }),
}));

describe("RouteSpecificPreferences", () => {
    beforeEach(() => {
        mockRoutesWithPreferences = [...MOCK_ROUTES_WITH_PREFERENCES];
        mockNextPreferenceId = 100;
        jest.clearAllMocks();
    });

    it("renders route preferences correctly", async () => {
        const screen = render(<RouteSpecificPreferences />);

        await waitFor(() => {
            expect(screen.getByText("Exactum")).toBeTruthy();
            expect(screen.getAllByText("Kamppi")).toHaveLength(2); // appears as from and to
            expect(screen.getByText("Pasila")).toBeTruthy();
        });

        // Check preferences are displayed
        expect(screen.getByText("Prefer bus 506")).toBeTruthy();
        expect(
            screen.getByText("Never use the tram for this route")
        ).toBeTruthy();
        expect(
            screen.getByText("Always use metro when available")
        ).toBeTruthy();
    });

    it("can add a new preference to a route", async () => {
        const screen = render(<RouteSpecificPreferences />);

        await waitFor(() => {
            expect(screen.getByText("Exactum")).toBeTruthy();
        });

        const routeKey = getRouteKey(
            MOCK_ROUTES_WITH_PREFERENCES[0].from.coordinates,
            MOCK_ROUTES_WITH_PREFERENCES[0].to.coordinates
        );

        // Find input for the first route
        const input = screen.getByTestId(`add-preference-input-${routeKey}`);
        const button = screen.getByTestId(`add-preference-button-${routeKey}`);

        // Add new preference
        fireEvent.changeText(input, "New preference");
        fireEvent.press(button);

        await waitFor(() => {
            expect(preferencesApi.addRoutePreference).toHaveBeenCalledWith(
                MOCK_ROUTES_WITH_PREFERENCES[0].from.coordinates,
                MOCK_ROUTES_WITH_PREFERENCES[0].to.coordinates,
                "New preference"
            );
        });
    });

    it("can delete a preference from a route", async () => {
        const screen = render(<RouteSpecificPreferences />);

        await waitFor(() => {
            expect(screen.getByText("Prefer bus 506")).toBeTruthy();
        });

        const routeKey = getRouteKey(
            MOCK_ROUTES_WITH_PREFERENCES[0].from.coordinates,
            MOCK_ROUTES_WITH_PREFERENCES[0].to.coordinates
        );

        // Find delete button for first preference
        const deleteButton = screen.getByTestId(
            `delete-preference-${routeKey}-1`
        );

        fireEvent.press(deleteButton);

        await waitFor(() => {
            expect(preferencesApi.deleteRoutePreference).toHaveBeenCalledWith(
                1
            );
        });
    });

    it("can add a new route", async () => {
        const screen = render(<RouteSpecificPreferences />);

        await waitFor(() => {
            expect(screen.getByText("Add new route preference")).toBeTruthy();
        });

        // Open new route form
        fireEvent.press(screen.getByTestId("add-new-route-button"));

        await waitFor(() => {
            expect(screen.getByTestId("new-route-from-input")).toBeTruthy();
            expect(screen.getByTestId("new-route-to-input")).toBeTruthy();
        });

        // Fill in route details
        const fromInput = screen.getByTestId("new-route-from-input");
        const toInput = screen.getByTestId("new-route-to-input");
        const addButton = screen.getByTestId("add-route-button");

        fireEvent.changeText(fromInput, "Helsinki");
        fireEvent.changeText(toInput, "Espoo");
        fireEvent.press(addButton);

        await waitFor(() => {
            expect(preferencesApi.addSavedRoute).toHaveBeenCalledWith(
                "Helsinki",
                "Espoo"
            );
        });
    });
});
