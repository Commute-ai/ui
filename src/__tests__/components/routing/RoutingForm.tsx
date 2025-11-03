import React, { useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react-native";

import { showAlert } from "@/lib/alert";

import { RoutingForm } from "@/components/routing/RoutingForm";

jest.mock("@/lib/alert");

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
        expect(screen.getByPlaceholderText("From")).toBeTruthy();
        expect(screen.getByPlaceholderText("To")).toBeTruthy();
        expect(screen.getByText("Go!")).toBeTruthy();
    });

    it('updates the "From" input, shows suggestions, and selects one', () => {
        render(<StatefulRoutingForm />);
        const fromInput = screen.getByPlaceholderText("From");

        // Type to show suggestions
        fireEvent.changeText(fromInput, "Hels");
        expect(screen.getByText("Helsinki")).toBeTruthy();
        expect(screen.getByText("Helsingin Yliopisto")).toBeTruthy();

        // Press a suggestion
        fireEvent.press(screen.getByText("Helsinki"));

        // Check if the input value was updated
        expect(fromInput.props.value).toBe("Helsinki");
    });

    it('updates the "To" input, shows suggestions, and selects one', () => {
        render(<StatefulRoutingForm />);
        const toInput = screen.getByPlaceholderText("To");

        fireEvent.changeText(toInput, "Kall");
        expect(screen.getByText("Kallio")).toBeTruthy();

        fireEvent.press(screen.getByText("Kallio"));
        expect(toInput.props.value).toBe("Kallio");
    });

    it('uses the current location when "Here" is pressed', () => {
        render(<StatefulRoutingForm />);
        const fromInput = screen.getByPlaceholderText("From");
        fireEvent.press(screen.getByText("Here"));
        expect(fromInput.props.value).toBe("Kamppi");
    });

    it("submits the form with the correct values", () => {
        const searchFn = jest.fn();
        render(<StatefulRoutingForm onSearch={searchFn} />);

        const fromInput = screen.getByPlaceholderText("From");
        const toInput = screen.getByPlaceholderText("To");

        fireEvent.changeText(fromInput, "Helsinki");
        fireEvent.changeText(toInput, "Kallio");
        fireEvent.press(screen.getByText("Go!"));

        expect(searchFn).toHaveBeenCalled();
        expect(showAlert).not.toHaveBeenCalled();
    });

    it("shows an alert if both fields are empty on submit", () => {
        render(<StatefulRoutingForm />);
        fireEvent.press(screen.getByText("Go!"));
        expect(showAlert).toHaveBeenCalledWith(
            "Missing information",
            "Please fill in both 'From' and 'To' fields."
        );
    });

    it("shows an alert if the 'From' field is empty on submit", () => {
        const searchFn = jest.fn();
        render(<StatefulRoutingForm onSearch={searchFn} />);
        const toInput = screen.getByPlaceholderText("To");

        fireEvent.changeText(toInput, "Kallio");
        fireEvent.press(screen.getByText("Go!"));

        expect(showAlert).toHaveBeenCalledWith(
            "Missing information",
            "Please fill in both 'From' and 'To' fields."
        );
        expect(searchFn).not.toHaveBeenCalled();
    });

    it("shows an alert if the 'To' field is empty on submit", () => {
        const searchFn = jest.fn();
        render(<StatefulRoutingForm onSearch={searchFn} />);
        const fromInput = screen.getByPlaceholderText("From");

        fireEvent.changeText(fromInput, "Helsinki");
        fireEvent.press(screen.getByText("Go!"));

        expect(showAlert).toHaveBeenCalledWith(
            "Missing information",
            "Please fill in both 'From' and 'To' fields."
        );
        expect(searchFn).not.toHaveBeenCalled();
    });
});
