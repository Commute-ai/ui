import React from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { RouteList } from "@/components/RouteList";

import { type Itinerary } from "@/types/routes";

const formatTime = (isoString: string) => {
    try {
        return new Date(isoString).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (e) {
        return "N/A";
    }
};

const mockRoutes: Itinerary[] = [
    {
        id: 1,
        start: "2023-01-01T10:00:00Z",
        end: "2023-01-01T11:00:00Z",
        duration: 3600,
        distance: 10000,
        walk_distance: 1000,
        legs: [],
        aiMatch: 95,
        aiReason: "Fastest route",
    },
    {
        id: 2,
        start: "2023-01-01T12:00:00Z",
        end: "2023-01-01T14:00:00Z",
        duration: 7200,
        distance: 20000,
        walk_distance: 2000,
        legs: [],
        aiMatch: 80,
        aiReason: "Scenic route",
    },
];

describe("RouteList", () => {
    it("renders loading indicator when isLoading is true", () => {
        render(<RouteList routes={[]} isLoading={true} error={null} />);
        expect(screen.getByText("Finding routes...")).toBeTruthy();
        expect(screen.getByTestId("activity-indicator")).toBeTruthy();
    });

    it("renders error message when error is provided", () => {
        const errorMessage = "Failed to fetch routes";
        render(
            <RouteList routes={[]} isLoading={false} error={errorMessage} />
        );
        expect(screen.getByText(errorMessage)).toBeTruthy();
    });

    it('renders "No routes found" when routes array is empty', () => {
        render(<RouteList routes={[]} isLoading={false} error={null} />);
        expect(screen.getByText("No routes found.")).toBeTruthy();
    });

    it("renders a list of routes", () => {
        render(
            <RouteList routes={mockRoutes} isLoading={false} error={null} />
        );
        expect(screen.getByText(formatTime(mockRoutes[0].start))).toBeTruthy();
        expect(screen.getByText(formatTime(mockRoutes[1].start))).toBeTruthy();
    });

    it("expands and collapses a route when toggled", () => {
        render(
            <RouteList routes={mockRoutes} isLoading={false} error={null} />
        );
        const route1 = screen.getByText(formatTime(mockRoutes[0].start));

        // Expand
        fireEvent.press(route1);
        expect(screen.getByText("Journey Details")).toBeTruthy();

        // Collapse
        fireEvent.press(route1);
        expect(screen.queryByText("Journey Details")).toBeNull();
    });

    it("only allows one route to be expanded at a time", () => {
        render(
            <RouteList routes={mockRoutes} isLoading={false} error={null} />
        );
        const route1Trigger = screen.getByText(formatTime(mockRoutes[0].start));
        const route2Trigger = screen.getByText(formatTime(mockRoutes[1].start));

        // Expand the first route
        fireEvent.press(route1Trigger);
        expect(screen.getAllByText("Journey Details")).toHaveLength(1);

        // Expanding the second route should collapse the first one
        fireEvent.press(route2Trigger);
        expect(screen.getAllByText("Journey Details")).toHaveLength(1);

        // Additionally, pressing the second route again should collapse it.
        fireEvent.press(route2Trigger);
        expect(screen.queryByText("Journey Details")).toBeNull();
    });
});
