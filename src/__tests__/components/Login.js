import LoginScreen from "../../components/Login";

import React from "react";

import { fireEvent, render } from "@testing-library/react-native";

// Adjust path as necessary

// Mock navigation prop
const mockNavigation = {
    navigate: jest.fn(),
};

describe("LoginScreen", () => {
    it("renders correctly and displays essential elements", () => {
        const { getByTestId, getByPlaceholderText } = render(
            <LoginScreen navigation={mockNavigation} />
        );

        // Check for title
        expect(getByTestId("title")).toBeTruthy();

        // Check for input fields
        expect(getByPlaceholderText("Username")).toBeTruthy();
        expect(getByPlaceholderText("Password")).toBeTruthy();

        // Check for login button
        expect(getByTestId("loginButton")).toBeTruthy();
    });

    it("calls console.log when login button is pressed", () => {
        const { getByTestId } = render(
            <LoginScreen navigation={mockNavigation} />
        );
        const loginButton = getByTestId("loginButton"); // Or use testID if you add one

        // Spy on console.log
        const consoleSpy = jest.spyOn(console, "log");

        fireEvent.press(loginButton);

        expect(consoleSpy).toHaveBeenCalledWith("Login button pressed");

        // Restore original console.log
        consoleSpy.mockRestore();
    });
});
