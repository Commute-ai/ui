import React from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { RouteCard } from "@/components/RouteCard";

import { type Itinerary, type RouteLeg } from "@/types/routes";

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

const mockRoute: Itinerary = {
    id: 1,
    start: "2023-01-01T10:00:00Z",
    end: "2023-01-01T10:45:00Z",
    duration: 2700, // 45 minutes in seconds
    distance: 5000,
    walk_distance: 800,
    legs: [
        {
            mode: "WALK",
            distance: 500,
            duration: 300, // 5 minutes
            from_place: { name: "Start" },
            to_place: { name: "Bus Stop A" },
        } as RouteLeg,
        {
            mode: "BUS",
            distance: 4200,
            duration: 1200, // 20 minutes
            route: { short_name: "101" },
            from_place: { name: "Bus Stop A" },
            to_place: { name: "Train Station B" },
        } as RouteLeg,
        {
            mode: "WALK",
            distance: 300,
            duration: 600, // 10 minutes
            from_place: { name: "Train Station B" },
            to_place: { name: "Destination" },
        } as RouteLeg,
    ],
    aiMatch: 92,
    aiReason:
        "This route is a good balance of speed and comfort based on your preferences.",
};

describe("RouteCard", () => {
    it("renders the compact view correctly", () => {
        render(<RouteCard route={mockRoute} />);

        // Check times
        expect(screen.getByText(formatTime(mockRoute.start))).toBeTruthy();
        expect(screen.getByText(formatTime(mockRoute.end))).toBeTruthy();
        expect(screen.getByText("45 min")).toBeTruthy();

        // Check for transit icons
        expect(screen.getByText("101")).toBeTruthy();

        // Check for AI reason
        expect(
            screen.getByText(
                "This route is a good balance of speed and comfort based on your preferences."
            )
        ).toBeTruthy();

        // Expanded details should not be visible
        expect(screen.queryByText("Journey Details")).toBeNull();
    });

    it("calls onToggle when pressed", () => {
        const onToggleMock = jest.fn();
        render(<RouteCard route={mockRoute} onToggle={onToggleMock} />);

        fireEvent.press(screen.getByText(formatTime(mockRoute.start)));
        expect(onToggleMock).toHaveBeenCalledTimes(1);
    });

    it("renders the expanded view when isExpanded is true", () => {
        render(<RouteCard route={mockRoute} isExpanded={true} />);

        // Check for expanded section title
        expect(screen.getByText("Journey Details")).toBeTruthy();

        // Check for leg details
        expect(screen.getByText(/Walk 500 m/)).toBeTruthy();
        expect(screen.getByText(/Bus 101/)).toBeTruthy();
        expect(screen.getByText(/Bus Stop A → Train Station B/)).toBeTruthy();
    });
});
