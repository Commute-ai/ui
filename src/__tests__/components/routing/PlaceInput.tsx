import React from "react";

import { fireEvent, render } from "@testing-library/react-native";

import { PlaceInput } from "@/components/routing/PlaceInput";

// Mock the Portal component to render suggestions inline for testing
jest.mock("@rn-primitives/portal", () => ({
    Portal: ({ children }: { children: React.ReactNode }) => children,
}));

describe("PlaceInput", () => {
    const mockOnChangeText = jest.fn();
    const mockOnSuggestionPress = jest.fn();
    const mockOnHerePress = jest.fn();

    it("renders correctly with a placeholder", () => {
        const { getByPlaceholderText } = render(
            <PlaceInput
                placeholder="From"
                value=""
                onChangeText={mockOnChangeText}
                onSuggestionPress={mockOnSuggestionPress}
                suggestions={[]}
            />
        );
        expect(getByPlaceholderText("From")).toBeTruthy();
    });

    it("calls onChangeText when input value changes", () => {
        const { getByPlaceholderText } = render(
            <PlaceInput
                placeholder="From"
                value=""
                onChangeText={mockOnChangeText}
                onSuggestionPress={mockOnSuggestionPress}
                suggestions={[]}
            />
        );
        fireEvent.changeText(getByPlaceholderText("From"), "Kallio");
        expect(mockOnChangeText).toHaveBeenCalledWith("Kallio");
    });

    it("displays suggestions when provided", () => {
        const suggestions = ["Kamppi", "Kallio"];
        const { getByText } = render(
            <PlaceInput
                placeholder="From"
                value="Ka"
                onChangeText={mockOnChangeText}
                suggestions={suggestions}
                onSuggestionPress={mockOnSuggestionPress}
            />
        );
        expect(getByText("Kamppi")).toBeTruthy();
        expect(getByText("Kallio")).toBeTruthy();
    });

    it("calls onSuggestionPress when a suggestion is pressed", () => {
        const suggestions = ["Kamppi", "Kallio"];
        const { getByText } = render(
            <PlaceInput
                placeholder="From"
                value="Ka"
                onChangeText={mockOnChangeText}
                suggestions={suggestions}
                onSuggestionPress={mockOnSuggestionPress}
            />
        );
        fireEvent.press(getByText("Kamppi"));
        expect(mockOnSuggestionPress).toHaveBeenCalledWith("Kamppi");
    });

    it('shows and interacts with the "Here" button', () => {
        const { getByText } = render(
            <PlaceInput
                placeholder="From"
                value=""
                onChangeText={mockOnChangeText}
                onSuggestionPress={mockOnSuggestionPress}
                suggestions={[]}
                showHereButton={true}
                onHerePress={mockOnHerePress}
            />
        );
        const hereButton = getByText("Here");
        expect(hereButton).toBeTruthy();
        fireEvent.press(hereButton);
        expect(mockOnHerePress).toHaveBeenCalled();
    });
});
