import React, { useState } from "react";

import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react-native";

import { showAlert } from "@/lib/alert";

import { RoutingForm } from "@/components/routing/RoutingForm";

jest.mock("@/lib/alert");

// Mock the Portal component to render suggestions inline for testing
jest.mock("@rn-primitives/portal", () => ({
    Portal: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the location service
jest.mock("@/lib/location");

// Helper component to manage the state of the controlled RoutingForm
const StatefulRoutingForm = ({ onSearch = jest.fn() }) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    return (
        <RoutingForm
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
            onSearch={onSearch}
        />
    );
};

describe("RoutingForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders two PlaceInput components and a submit button", () => {
        render(<StatefulRoutingForm />);
        expect(
            screen.getByPlaceholderText("Enter origin (e.g., Exactum)")
        ).toBeTruthy();
        expect(
            screen.getByPlaceholderText("Enter destination (e.g., Kamppi)")
        ).toBeTruthy();
        expect(screen.getByText("Search routes")).toBeTruthy();
    });

    it('updates the "From" input, shows suggestions, and selects one', async () => {
        render(<StatefulRoutingForm />);
        const fromInput = screen.getByPlaceholderText(
            "Enter origin (e.g., Exactum)"
        );

        // Type to show suggestions
        await act(async () => {
            fireEvent.changeText(fromInput, "Hels");
        });

        await waitFor(() => {
            expect(screen.getByText("Helsinki")).toBeTruthy();
            expect(screen.getByText("Helsingin Yliopisto")).toBeTruthy();
        });

        // Press a suggestion
        fireEvent.press(screen.getByText("Helsinki"));

        // Check if the input value was updated
        expect(fromInput.props.value).toBe("Helsinki");
    });

    it('updates the "To" input, shows suggestions, and selects one', async () => {
        render(<StatefulRoutingForm />);
        const toInput = screen.getByPlaceholderText(
            "Enter destination (e.g., Kamppi)"
        );

        await act(async () => {
            fireEvent.changeText(toInput, "Kall");
        });

        await waitFor(() => {
            expect(screen.getByText("Kallio")).toBeTruthy();
        });

        fireEvent.press(screen.getByText("Kallio"));
        expect(toInput.props.value).toBe("Kallio");
    });

    it('uses the current location when "Here" is pressed', async () => {
        render(<StatefulRoutingForm />);
        const fromInput = screen.getByPlaceholderText(
            "Enter origin (e.g., Exactum)"
        );

        await act(async () => {
            fireEvent.press(screen.getByText("Here"));
        });

        await waitFor(() => {
            expect(fromInput.props.value).toBe("Kamppi");
        });
    });

    it("submits the form with the correct values", () => {
        const searchFn = jest.fn();
        render(<StatefulRoutingForm onSearch={searchFn} />);

        const fromInput = screen.getByPlaceholderText(
            "Enter origin (e.g., Exactum)"
        );
        const toInput = screen.getByPlaceholderText(
            "Enter destination (e.g., Kamppi)"
        );

        fireEvent.changeText(fromInput, "Helsinki");
        fireEvent.changeText(toInput, "Kallio");
        fireEvent.press(screen.getByText("Search routes"));

        expect(searchFn).toHaveBeenCalled();
        expect(showAlert).not.toHaveBeenCalled();
    });

    it("button does not trigger validation when both fields are empty", () => {
        const searchFn = jest.fn();
        render(<StatefulRoutingForm onSearch={searchFn} />);
        const searchButton = screen.getByText("Search routes");

        fireEvent.press(searchButton);

        // Should not call search function or show alert due to disabled state
        expect(searchFn).not.toHaveBeenCalled();
        expect(showAlert).not.toHaveBeenCalled();
    });

    it("button does not trigger validation when only one field is filled", () => {
        const searchFn = jest.fn();
        render(<StatefulRoutingForm onSearch={searchFn} />);
        const toInput = screen.getByPlaceholderText(
            "Enter destination (e.g., Kamppi)"
        );

        fireEvent.changeText(toInput, "Kallio");
        fireEvent.press(screen.getByText("Search routes"));

        // Should not call search function due to disabled state
        expect(searchFn).not.toHaveBeenCalled();
    });

    it("shows an alert if the 'From' field contains an invalid location", () => {
        const searchFn = jest.fn();
        render(<StatefulRoutingForm onSearch={searchFn} />);

        const fromInput = screen.getByPlaceholderText(
            "Enter origin (e.g., Exactum)"
        );
        const toInput = screen.getByPlaceholderText(
            "Enter destination (e.g., Kamppi)"
        );

        fireEvent.changeText(fromInput, "Invalid Location");
        fireEvent.changeText(toInput, "Helsinki");
        fireEvent.press(screen.getByText("Search routes"));

        expect(showAlert).toHaveBeenCalledWith(
            "Invalid location",
            "Please select a valid location from the suggestions for 'From' field."
        );
        expect(searchFn).not.toHaveBeenCalled();
    });

    it("shows an alert if the 'To' field contains an invalid location", () => {
        const searchFn = jest.fn();
        render(<StatefulRoutingForm onSearch={searchFn} />);

        const fromInput = screen.getByPlaceholderText(
            "Enter origin (e.g., Exactum)"
        );
        const toInput = screen.getByPlaceholderText(
            "Enter destination (e.g., Kamppi)"
        );

        fireEvent.changeText(fromInput, "Helsinki");
        fireEvent.changeText(toInput, "Invalid Location");
        fireEvent.press(screen.getByText("Search routes"));

        expect(showAlert).toHaveBeenCalledWith(
            "Invalid location",
            "Please select a valid location from the suggestions for 'To' field."
        );
        expect(searchFn).not.toHaveBeenCalled();
    });
});
