import { authApi } from "../../api";
import Registration from "../../components/Registration";

import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react-native";

// Mock the authApi
jest.mock("../../api", () => ({
    authApi: {
        register: jest.fn(),
    },
}));

jest.mock("../../config/environment", () => ({
    __esModule: true,
    default: {
        apiUrl: "http://localhost:8000/api/v1",
    },
}));

// Mock navigation prop
const mockNavigation = {
    navigate: jest.fn(),
};

describe("Registration Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders create account title, input fields, and buttons", async () => {
        const { findByText, findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation} />
        );

        expect(await findByText("Create Account")).toBeTruthy();
        expect(await findByPlaceholderText("Username")).toBeTruthy();
        expect(await findByPlaceholderText("Password")).toBeTruthy();
        expect(await findByPlaceholderText("Confirm Password")).toBeTruthy();
        expect(await findByTestId("registerButton")).toBeTruthy();
        expect(await findByText("Back to Login")).toBeTruthy();
    });

    it('navigates to Login screen on "Back to Login" press', async () => {
        const { findByText } = render(
            <Registration navigation={mockNavigation} />
        );

        const backButton = await findByText("Back to Login");
        fireEvent.press(backButton);

        expect(mockNavigation.navigate).toHaveBeenCalledWith("Login");
    });

    it("shows validation error if passwords don't match", async () => {
        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation} />
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "differentPassword");
        fireEvent.press(registerButton);

        const errorText = await findByTestId("errorMessage");
        expect(errorText.props.children).toBe("Passwords don't match!");

        expect(mockNavigation.navigate).not.toHaveBeenCalled();
        expect(authApi.register).not.toHaveBeenCalled();
    });

    it("shows validation error if username is empty", async () => {
        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation} />
        );

        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "password123");
        fireEvent.press(registerButton);

        const errorText = await findByTestId("errorMessage");
        expect(errorText.props.children).toBe("Please fill in all fields.");

        expect(authApi.register).not.toHaveBeenCalled();
    });

    it("handles successful registration and navigates to Login", async () => {
        authApi.register.mockResolvedValueOnce({
            message: "Registration successful",
        });

        const { findByPlaceholderText, findByTestId, queryByTestId } = render(
            <Registration navigation={mockNavigation} />
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "password123");
        fireEvent.press(registerButton);

        await waitFor(() => {
            expect(mockNavigation.navigate).toHaveBeenCalledWith("Login");
        });

        // Should not show any error
        expect(queryByTestId("errorMessage")).toBeNull();
    });

    it("shows error message when username already exists (409 conflict)", async () => {
        const error = new Error(
            "This username is already taken. Please choose another."
        );
        authApi.register.mockRejectedValueOnce(error);

        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation} />
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "password123");
        fireEvent.press(registerButton);

        await waitFor(async () => {
            const errorElement = await findByTestId("errorMessage");
            expect(errorElement).toBeTruthy();
            expect(errorElement.props.children).toContain("already taken");
        });

        expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });

    it("shows error message for validation errors", async () => {
        const error = new Error("Please enter a valid username and password.");
        authApi.register.mockRejectedValueOnce(error);

        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation} />
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(usernameInput, "test user");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "password123");
        fireEvent.press(registerButton);

        await waitFor(async () => {
            const errorElement = await findByTestId("errorMessage");
            expect(errorElement).toBeTruthy();
        });

        expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });

    it("shows error message for server errors", async () => {
        const error = new Error("Server error. Please try again later.");
        authApi.register.mockRejectedValueOnce(error);

        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation} />
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "password123");
        fireEvent.press(registerButton);

        await waitFor(async () => {
            const errorElement = await findByTestId("errorMessage");
            expect(errorElement.props.children).toContain("Server error");
        });

        expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });

    it("shows error message for network failures", async () => {
        const error = new Error("Network error. Please check your connection.");
        authApi.register.mockRejectedValueOnce(error);

        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation} />
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "password123");
        fireEvent.press(registerButton);

        await waitFor(async () => {
            const errorElement = await findByTestId("errorMessage");
            expect(errorElement.props.children).toContain("Network error");
        });

        expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });

    it("shows loading indicator during registration", async () => {
        authApi.register.mockImplementation(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            return { message: "Success" };
        });

        const { findByTestId, queryByTestId, findByPlaceholderText } = render(
            <Registration navigation={mockNavigation} />
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "password123");
        fireEvent.press(registerButton);

        expect(await findByTestId("loadingIndicator")).toBeTruthy();

        await waitFor(() => {
            expect(queryByTestId("loadingIndicator")).toBeNull();
        });
    });

    it("disables inputs during registration", async () => {
        authApi.register.mockImplementation(async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            return { message: "Success" };
        });

        const { findByTestId, findByPlaceholderText } = render(
            <Registration navigation={mockNavigation} />
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "password123");
        fireEvent.press(registerButton);

        await waitFor(() => {
            expect(usernameInput.props.editable).toBe(false);
            expect(passwordInput.props.editable).toBe(false);
            expect(confirmPasswordInput.props.editable).toBe(false);
        });
    });
});
