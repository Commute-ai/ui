import React from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { RouteCard } from "@/components/RouteCard";

import { type Route } from "@/types/routes";

const mockRoute: Route = {
    id: 1,
    departureTime: "10:00",
    arrivalTime: "10:45",
    duration: 45,
    legs: [
        {
            mode: "walk",
            distance: "500m",
            from: "Start",
            to: "Bus Stop A",
            duration: 5,
            line: "",
        },
        {
            mode: "bus",
            line: "101",
            from: "Bus Stop A",
            to: "Train Station B",
            duration: 20,
        },
        {
            mode: "walk",
            distance: "300m",
            from: "Train Station B",
            to: "Destination",
            duration: 10,
            line: "",
        },
    ],
    aiMatch: 92,
    aiReason:
        "This route is highly rated for its punctuality and low number of changes.",
    // a lot of other properties are not needed for this test
} as unknown as Route;

describe("RouteCard", () => {
    it("renders the compact view correctly", () => {
        render(<RouteCard route={mockRoute} />);

        // Check times
        expect(screen.getByText("10:00")).toBeTruthy();
        expect(screen.getByText("10:45")).toBeTruthy();
        expect(screen.getByText("45 min")).toBeTruthy();

        // Check for transit icons (presence of bus icon is a good indicator)
        expect(screen.getByText("101")).toBeTruthy();

        // Check for AI reason
        expect(
            screen.getByText(
                "This route is highly rated for its punctuality and low number of changes."
            )
        ).toBeTruthy();

        // Expanded details should not be visible
        expect(screen.queryByText("Journey Details")).toBeNull();
    });

    it("calls onToggle when pressed", () => {
        const onToggleMock = jest.fn();
        render(<RouteCard route={mockRoute} onToggle={onToggleMock} />);

        fireEvent.press(screen.getByText("10:00"));
        expect(onToggleMock).toHaveBeenCalledTimes(1);
    });

    it("renders the expanded view when isExpanded is true", () => {
        render(<RouteCard route={mockRoute} isExpanded={true} />);

        // Check for expanded section title
        expect(screen.getByText("Journey Details")).toBeTruthy();

        // Check for leg details
        expect(screen.getAllByText(/walk 500m/i).length).toBe(2);
        expect(screen.getAllByText(/101/).length).toBe(4);
        expect(screen.getAllByText(/Bus Stop A → Train Station B/).length).toBe(
            2
        );
    });
});
