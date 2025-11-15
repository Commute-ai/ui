import React from "react";

import {
    fireEvent,
    render,
    waitFor,
    within,
} from "@testing-library/react-native";

import preferencesApi, {
    Route,
    RoutePreference,
    RouteWithPreferences,
} from "@/lib/api/preferences";

import RouteSpecificPreferences from "@/components/RouteSpecificPreferences";

const getRouteKey = (route: Route) =>
    `${route.fromLat},${route.fromLon},${route.toLat},${route.toLon}`;

// Mock data
const MOCK_ROUTES_WITH_PREFERENCES: RouteWithPreferences[] = [
    {
        route: {
            from: "Exactum",
            to: "Kamppi",
            fromLat: 60.204,
            fromLon: 24.962,
            toLat: 60.169,
            toLon: 24.932,
        },
        preferences: [
            {
                id: 1,
                prompt: "Prefer bus 506",
                created_at: "2023-01-01T12:00:00.000Z",
                from_latitude: 60.204,
                from_longitude: 24.962,
                to_latitude: 60.169,
                to_longitude: 24.932,
                updated_at: null,
            },
            {
                id: 2,
                prompt: "Never use the tram for this route",
                created_at: "2023-01-01T12:00:00.000Z",
                from_latitude: 60.204,
                from_longitude: 24.962,
                to_latitude: 60.169,
                to_longitude: 24.932,
                updated_at: null,
            },
            {
                id: 3,
                prompt: "Avoid rush hour metro",
                created_at: "2023-01-01T12:00:00.000Z",
                from_latitude: 60.204,
                from_longitude: 24.962,
                to_latitude: 60.169,
                to_longitude: 24.932,
                updated_at: null,
            },
        ],
    },
    {
        route: {
            from: "Kamppi",
            to: "Pasila",
            fromLat: 60.169,
            fromLon: 24.932,
            toLat: 60.199,
            toLon: 24.934,
        },
        preferences: [
            {
                id: 4,
                prompt: "Always use metro when available",
                created_at: "2023-01-01T12:00:00.000Z",
                from_latitude: 60.169,
                from_longitude: 24.932,
                to_latitude: 60.199,
                to_longitude: 24.934,
                updated_at: null,
            },
            {
                id: 5,
                prompt: "Avoid walking through Töölö",
                created_at: "2023-01-01T12:00:00.000Z",
                from_latitude: 60.169,
                from_longitude: 24.932,
                to_latitude: 60.199,
                to_longitude: 24.934,
                updated_at: null,
            },
        ],
    },
];

let mockRoutesWithPreferences: RouteWithPreferences[];
let mockNextPreferenceId: number;

// Mock the API module
jest.mock("@/lib/api/preferences", () => ({
    getRoutesWithPreferences: jest.fn(async () => mockRoutesWithPreferences),
    addRouteSpecificPreference: jest.fn(
        async (route: Route, { prompt }: { prompt: string }) => {
            const newPreference: RoutePreference = {
                id: mockNextPreferenceId++,
                prompt,
                created_at: new Date().toISOString(),
                from_latitude: route.fromLat,
                from_longitude: route.fromLon,
                to_latitude: route.toLat,
                to_longitude: route.toLon,
                updated_at: null,
            };
            mockRoutesWithPreferences = mockRoutesWithPreferences.map((r) =>
                getRouteKey(r.route) === getRouteKey(route)
                    ? { ...r, preferences: [...r.preferences, newPreference] }
                    : r
            );
            return newPreference;
        }
    ),
    deleteRouteSpecificPreference: jest.fn(
        async (route: Route, preferenceId: number) => {
            mockRoutesWithPreferences = mockRoutesWithPreferences.map((r) =>
                getRouteKey(r.route) === getRouteKey(route)
                    ? {
                          ...r,
                          preferences: r.preferences.filter(
                              (p) => p.id !== preferenceId
                          ),
                      }
                    : r
            );
        }
    ),
    addSavedRoute: jest.fn(async (from: string, to: string) => {
        const newRoute: RouteWithPreferences = {
            route: {
                from,
                to,
                fromLat: 60.224, // Dummy coords
                fromLon: 24.952,
                toLat: 60.189,
                toLon: 25.042,
            },
            preferences: [],
        };
        mockRoutesWithPreferences.push(newRoute);
    }),
    __resetMocks: () => {
        mockRoutesWithPreferences = JSON.parse(
            JSON.stringify(MOCK_ROUTES_WITH_PREFERENCES)
        );
        mockNextPreferenceId = 6;
    },
}));

// Mock the location service hook
jest.mock("@/lib/location", () => ({
    useLocationService: () => ({
        getSuggestions: jest.fn().mockResolvedValue([]),
        isValidPlace: jest.fn().mockReturnValue(true),
    }),
}));

describe("RouteSpecificPreferences component", () => {
    // Define route keys based on mock data
    const route1Key = getRouteKey(MOCK_ROUTES_WITH_PREFERENCES[0].route);
    const route2Key = getRouteKey(MOCK_ROUTES_WITH_PREFERENCES[1].route);

    beforeEach(() => {
        preferencesApi.__resetMocks();
    });

    it("should render initial routes and preferences", async () => {
        const { findByTestId } = render(<RouteSpecificPreferences />);

        // Check for first route
        const route1 = await findByTestId(`route-preferences-${route1Key}`);
        expect(within(route1).getByText("Exactum")).toBeTruthy();
        expect(within(route1).getByText("Kamppi")).toBeTruthy();
        expect(
            within(route1).getByText("Never use the tram for this route")
        ).toBeTruthy();
        expect(within(route1).getByText("Prefer bus 506")).toBeTruthy();
        expect(within(route1).getByText("Avoid rush hour metro")).toBeTruthy();

        // Check for second route
        const route2 = await findByTestId(`route-preferences-${route2Key}`);
        expect(within(route2).getByText("Kamppi")).toBeTruthy();
        expect(within(route2).getByText("Pasila")).toBeTruthy();
        expect(
            within(route2).getByText("Always use metro when available")
        ).toBeTruthy();
        expect(
            within(route2).getByText("Avoid walking through Töölö")
        ).toBeTruthy();
    });

    it("should add a new preference to a route", async () => {
        const { getByTestId, findByText, findByTestId } = render(
            <RouteSpecificPreferences />
        );
        const newPreference = "Use a city bike";

        const input = await findByTestId(`add-preference-input-${route1Key}`);
        fireEvent.changeText(input, newPreference);

        const addButton = getByTestId(`add-preference-button-${route1Key}`);
        fireEvent.press(addButton);

        await waitFor(async () => {
            expect(await findByText(newPreference)).toBeTruthy();
        });
    });

    it("should delete a preference from a route", async () => {
        const { queryByText, findByTestId } = render(
            <RouteSpecificPreferences />
        );
        const preferenceToDelete = "Prefer bus 506";
        const preferenceId = MOCK_ROUTES_WITH_PREFERENCES[0].preferences[0].id;

        const deleteButton = await findByTestId(
            `delete-preference-${route1Key}-${preferenceId}`
        );
        fireEvent.press(deleteButton);

        await waitFor(() => {
            expect(queryByText(preferenceToDelete)).toBeNull();
        });
    });

    it("should add a new route", async () => {
        const { getByTestId, findByText, findByPlaceholderText } = render(
            <RouteSpecificPreferences />
        );

        const addNewRouteButton = getByTestId("add-new-route-button");
        fireEvent.press(addNewRouteButton);

        const fromInput = await findByPlaceholderText("From");
        const toInput = await findByPlaceholderText("To");
        const addRouteButton = getByTestId("add-route-button");

        fireEvent.changeText(fromInput, "Kumpula");
        fireEvent.changeText(toInput, "Herttoniemi");

        fireEvent.press(addRouteButton);

        await waitFor(async () => {
            // The component refetches after adding, so we wait for the new content to appear
            expect(await findByText("Kumpula")).toBeTruthy();
            expect(await findByText("Herttoniemi")).toBeTruthy();
        });
    });

    it("should cancel adding a new route", async () => {
        const { getByTestId, queryByPlaceholderText, findByTestId } = render(
            <RouteSpecificPreferences />
        );

        const addNewRouteButton = getByTestId("add-new-route-button");
        fireEvent.press(addNewRouteButton);

        const cancelButton = await findByTestId("cancel-add-route-button");
        fireEvent.press(cancelButton);

        await waitFor(() => {
            expect(queryByPlaceholderText("From")).toBeNull();
            expect(queryByPlaceholderText("To")).toBeNull();
        });
    });
});
