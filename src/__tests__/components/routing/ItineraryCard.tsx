import React from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { formatTime } from "@/lib/utils";

import { ItineraryCard } from "@/components/routing/ItineraryCard";

import { type Itinerary } from "@/types/itinerary";

const mockItinerary: Itinerary = {
    start: new Date("2023-01-01T10:00:00Z"),
    end: new Date("2023-01-01T10:45:00Z"),
    duration: 2700, // 45 minutes in seconds
    walk_distance: 800,
    walk_time: 10,
    legs: [
        {
            mode: "WALK",
            start: new Date("2023-01-01T10:00:00Z"),
            end: new Date("2023-01-01T10:05:00Z"),
            duration: 300, // 5 minutes
            distance: 500,
            from_place: {
                name: "Start",
                coordinates: { latitude: 0, longitude: 0 },
            },
            to_place: {
                name: "Bus Stop A",
                coordinates: { latitude: 0, longitude: 0 },
            },
        },
        {
            mode: "BUS",
            start: new Date("2023-01-01T10:05:00Z"),
            end: new Date("2023-01-01T10:25:00Z"),
            duration: 1200, // 20 minutes
            distance: 4200,
            from_place: {
                name: "Bus Stop A",
                coordinates: { latitude: 0, longitude: 0 },
            },
            to_place: {
                name: "Train Station B",
                coordinates: { latitude: 0, longitude: 0 },
            },
            route: { short_name: "101", long_name: "Downtown Express" },
        },
        {
            mode: "WALK",
            start: new Date("2023-01-01T10:25:00Z"),
            end: new Date("2023-01-01T10:35:00Z"),
            duration: 600, // 10 minutes
            distance: 300,
            from_place: {
                name: "Train Station B",
                coordinates: { latitude: 0, longitude: 0 },
            },
            to_place: {
                name: "Destination",
                coordinates: { latitude: 0, longitude: 0 },
            },
        },
    ],
};

describe("ItineraryCard", () => {
    it("renders the compact view correctly", () => {
        render(<ItineraryCard itinerary={mockItinerary} />);

        // Check times
        expect(screen.getByText(formatTime(mockItinerary.start))).toBeTruthy();
        expect(screen.getByText(formatTime(mockItinerary.end))).toBeTruthy();
        expect(screen.getByText("45 min")).toBeTruthy();

        // Check for transit icons
        expect(screen.getByText("101")).toBeTruthy();

        // Expanded details should not be visible
        expect(screen.queryByText("Journey Details")).toBeNull();
    });

    it("calls onToggle when pressed", () => {
        const onToggleMock = jest.fn();
        render(
            <ItineraryCard itinerary={mockItinerary} onToggle={onToggleMock} />
        );

        fireEvent.press(screen.getByText(formatTime(mockItinerary.start)));
        expect(onToggleMock).toHaveBeenCalledTimes(1);
    });

    it("renders the expanded view when isExpanded is true", () => {
        render(<ItineraryCard itinerary={mockItinerary} isExpanded={true} />);

        // Check for expanded section title
        expect(screen.getByText("Journey Details")).toBeTruthy();

        // Check for leg details
        expect(screen.getByText(/Walk 500 m/)).toBeTruthy();
        expect(screen.getByText(/Bus 101/)).toBeTruthy();
        expect(screen.getByText(/Bus Stop A → Train Station B/)).toBeTruthy();
    });
});
