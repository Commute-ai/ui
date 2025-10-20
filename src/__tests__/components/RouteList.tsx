import React from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { RouteList } from "@/components/RouteList";

import { type Route } from "@/types/routes";

const mockRoutes: Route[] = [
    {
        id: 1,
        name: "Route 1",
        description: "Description 1",
        length: "10 km",
        estimated_time: "1 hour",
        transport_type: "walking",
        route_points: [],
        created_at: "2023-01-01T12:00:00Z",
        updated_at: "2023-01-01T12:00:00Z",
        user_id: 1,
        user: {
            id: 1,
            username: "user1",
            email: "user1@example.com",
            created_at: "2023-01-01T12:00:00Z",
        },
        legs: [],
        departureTime: "10:00",
        arrivalTime: "11:00",
        duration: 60,
        aiMatch: 95,
        aiReason: "Fastest route",
    },
    {
        id: 2,
        name: "Route 2",
        description: "Description 2",
        length: "20 km",
        estimated_time: "2 hours",
        transport_type: "cycling",
        route_points: [],
        created_at: "2023-01-01T12:00:00Z",
        updated_at: "2023-01-01T12:00:00Z",
        user_id: 1,
        user: {
            id: 1,
            username: "user1",
            email: "user1@example.com",
            created_at: "2023-01-01T12:00:00Z",
        },
        legs: [],
        departureTime: "12:00",
        arrivalTime: "14:00",
        duration: 120,
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
        expect(screen.getByText("10:00")).toBeTruthy();
        expect(screen.getByText("12:00")).toBeTruthy();
    });

    it("expands and collapses a route when toggled", () => {
        render(
            <RouteList routes={mockRoutes} isLoading={false} error={null} />
        );
        const route1 = screen.getByText("10:00");

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
        const route1Trigger = screen.getByText("10:00");
        const route2Trigger = screen.getByText("12:00");

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
