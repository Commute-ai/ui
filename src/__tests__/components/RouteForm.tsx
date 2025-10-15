import { RouteForm } from "../../components/RouteForm";

import React from "react";

import { fireEvent, render } from "@testing-library/react-native";

import { showAlert } from "@/lib/alert";

jest.mock("@/lib/alert");

describe("RouteForm", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders two PlaceInput components and a submit button", () => {
        const { getByPlaceholderText, getByText } = render(<RouteForm />);
        expect(getByPlaceholderText("From")).toBeTruthy();
        expect(getByPlaceholderText("To")).toBeTruthy();
        expect(getByText("Go!")).toBeTruthy();
    });

    it('updates the "From" input and shows suggestions', () => {
        const { getByPlaceholderText, getByText } = render(<RouteForm />);
        const fromInput = getByPlaceholderText("From");
        fireEvent.changeText(fromInput, "Hels");
        expect(fromInput.props.value).toBe("Hels");
        expect(getByText("Helsinki")).toBeTruthy();
        expect(getByText("Helsingin Yliopisto")).toBeTruthy();
    });

    it('updates the "To" input and shows suggestions', () => {
        const { getByPlaceholderText, getByText } = render(<RouteForm />);
        const toInput = getByPlaceholderText("To");
        fireEvent.changeText(toInput, "Kall");
        expect(toInput.props.value).toBe("Kall");
        expect(getByText("Kallio")).toBeTruthy();
    });

    it('sets the "From" input when a suggestion is pressed', () => {
        const { getByPlaceholderText, getByText } = render(<RouteForm />);
        const fromInput = getByPlaceholderText("From");
        fireEvent.changeText(fromInput, "Hels");
        fireEvent.press(getByText("Helsinki"));
        expect(fromInput.props.value).toBe("Helsinki");
    });

    it('sets the "To" input when a suggestion is pressed', () => {
        const { getByPlaceholderText, getByText } = render(<RouteForm />);
        const toInput = getByPlaceholderText("To");
        fireEvent.changeText(toInput, "Kall");
        fireEvent.press(getByText("Kallio"));
        expect(toInput.props.value).toBe("Kallio");
    });

    it('uses the current location when "Here" is pressed', () => {
        const { getByPlaceholderText, getByText } = render(<RouteForm />);
        const fromInput = getByPlaceholderText("From");
        fireEvent.press(getByText("Here"));
        expect(fromInput.props.value).toBe("Kamppi");
    });

    it("submits the form with the correct values", () => {
        const consoleSpy = jest.spyOn(console, "log");
        const { getByPlaceholderText, getByText } = render(<RouteForm />);
        const fromInput = getByPlaceholderText("From");
        const toInput = getByPlaceholderText("To");

        fireEvent.changeText(fromInput, "Helsinki");
        fireEvent.changeText(toInput, "Kallio");
        fireEvent.press(getByText("Go!"));

        expect(consoleSpy).toHaveBeenCalledWith(
            "Searching for a route from Helsinki to Kallio"
        );
        expect(showAlert).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it("shows an alert if both fields are empty on submit", () => {
        const consoleSpy = jest.spyOn(console, "log");
        const { getByText } = render(<RouteForm />);
        fireEvent.press(getByText("Go!"));
        expect(showAlert).toHaveBeenCalledWith(
            "Missing information",
            "Please fill in both 'From' and 'To' fields."
        );
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it("shows an alert if the 'From' field is empty on submit", () => {
        const consoleSpy = jest.spyOn(console, "log");
        const { getByPlaceholderText, getByText } = render(<RouteForm />);
        const toInput = getByPlaceholderText("To");

        fireEvent.changeText(toInput, "Kallio");
        fireEvent.press(getByText("Go!"));

        expect(showAlert).toHaveBeenCalledWith(
            "Missing information",
            "Please fill in both 'From' and 'To' fields."
        );
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it("shows an alert if the 'To' field is empty on submit", () => {
        const consoleSpy = jest.spyOn(console, "log");
        const { getByPlaceholderText, getByText } = render(<RouteForm />);
        const fromInput = getByPlaceholderText("From");

        fireEvent.changeText(fromInput, "Helsinki");
        fireEvent.press(getByText("Go!"));

        expect(showAlert).toHaveBeenCalledWith(
            "Missing information",
            "Please fill in both 'From' and 'To' fields."
        );
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});
