import React from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { formatTime } from "@/lib/utils";

import { ItineraryList } from "@/components/routing/ItineraryList";

import { type Itinerary } from "@/types/itinerary";

const mockItineraries: Itinerary[] = [
    {
        start: new Date("2023-01-01T10:00:00Z"),
        end: new Date("2023-01-01T11:00:00Z"),
        duration: 3600,
        walk_distance: 1000,
        walk_time: 15,
        legs: [],
    },
    {
        start: new Date("2023-01-01T12:00:00Z"),
        end: new Date("2023-01-01T14:00:00Z"),
        duration: 7200,
        walk_distance: 2000,
        walk_time: 30,
        legs: [],
    },
];

describe("ItineraryList", () => {
    it("renders loading indicator when isLoading is true", () => {
        render(
            <ItineraryList itineraries={[]} isLoading={true} error={null} />
        );
        expect(screen.getByText("Finding itineraries...")).toBeTruthy();
        expect(screen.getByTestId("activity-indicator")).toBeTruthy();
    });

    it("renders error message when error is provided", () => {
        const errorMessage = "Failed to fetch itineraries";
        render(
            <ItineraryList
                itineraries={[]}
                isLoading={false}
                error={errorMessage}
            />
        );
        expect(screen.getByText(errorMessage)).toBeTruthy();
    });

    it('renders "No itineraries found" when itineraries array is empty', () => {
        render(
            <ItineraryList itineraries={[]} isLoading={false} error={null} />
        );
        expect(screen.getByText("No itineraries found.")).toBeTruthy();
    });

    it("renders a list of itineraries", () => {
        render(
            <ItineraryList
                itineraries={mockItineraries}
                isLoading={false}
                error={null}
            />
        );
        expect(
            screen.getByText(formatTime(mockItineraries[0].start))
        ).toBeTruthy();
        expect(
            screen.getByText(formatTime(mockItineraries[1].start))
        ).toBeTruthy();
    });

    it("expands and collapses a itinerary when toggled", () => {
        render(
            <ItineraryList
                itineraries={mockItineraries}
                isLoading={false}
                error={null}
            />
        );
        const itinerary1 = screen.getByText(
            formatTime(mockItineraries[0].start)
        );

        // Expand
        fireEvent.press(itinerary1);
        expect(screen.getByText("Journey Details")).toBeTruthy();

        // Collapse
        fireEvent.press(itinerary1);
        expect(screen.queryByText("Journey Details")).toBeNull();
    });

    it("only allows one itinerary to be expanded at a time", () => {
        render(
            <ItineraryList
                itineraries={mockItineraries}
                isLoading={false}
                error={null}
            />
        );
        const itinerary1Trigger = screen.getByText(
            formatTime(mockItineraries[0].start)
        );
        const itinerary2Trigger = screen.getByText(
            formatTime(mockItineraries[1].start)
        );

        // Expand the first itinerary
        fireEvent.press(itinerary1Trigger);
        expect(screen.getAllByText("Journey Details")).toHaveLength(1);

        // Expanding the second itinerary should collapse the first one
        fireEvent.press(itinerary2Trigger);
        expect(screen.getAllByText("Journey Details")).toHaveLength(1);

        // Additionally, pressing the second itinerary again should collapse it.
        fireEvent.press(itinerary2Trigger);
        expect(screen.queryByText("Journey Details")).toBeNull();
    });
});
