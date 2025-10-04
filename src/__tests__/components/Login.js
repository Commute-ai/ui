import { authApi } from "../../api";
import LoginScreen from "../../components/Login";
import storage from "../../utils/storage";

import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react-native";

// Mock the API and storage modules
jest.mock("../../api", () => ({
    authApi: {
        login: jest.fn(),
    },
}));

jest.mock("../../utils/storage", () => ({
    __esModule: true,
    default: {
        saveToken: jest.fn(),
    },
}));

// Mock navigation prop
const mockNavigation = {
    navigate: jest.fn(),
};

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly and displays essential elements", () => {
        const { getByTestId, getByPlaceholderText } = render(
            <LoginScreen navigation={mockNavigation} />
        );

        // Check for title
        expect(getByTestId("title")).toBeTruthy();

        // Check for input fields
        expect(getByPlaceholderText("Email")).toBeTruthy();
        expect(getByPlaceholderText("Password")).toBeTruthy();

        // Check for login button
        expect(getByTestId("loginButton")).toBeTruthy();
    });

    it("shows validation error when email is empty", async () => {
        const { getByTestId } = render(
            <LoginScreen navigation={mockNavigation} />
        );
        const loginButton = getByTestId("loginButton");

        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(getByTestId("errorMessage")).toBeTruthy();
        });
    });

    it("shows validation error when password is empty", async () => {
        const { getByTestId } = render(
            <LoginScreen navigation={mockNavigation} />
        );
        const emailInput = getByTestId("emailInput");
        const loginButton = getByTestId("loginButton");

        fireEvent.changeText(emailInput, "test@example.com");
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(getByTestId("errorMessage")).toBeTruthy();
        });
    });

    it("calls authApi.login with correct credentials and navigates on success", async () => {
        const mockResponse = { access_token: "test-token-123" };
        authApi.login.mockResolvedValueOnce(mockResponse);

        const { getByTestId } = render(
            <LoginScreen navigation={mockNavigation} />
        );

        const emailInput = getByTestId("emailInput");
        const passwordInput = getByTestId("passwordInput");
        const loginButton = getByTestId("loginButton");

        fireEvent.changeText(emailInput, "test@example.com");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(authApi.login).toHaveBeenCalledWith(
                "test@example.com",
                "password123"
            );
            expect(storage.saveToken).toHaveBeenCalledWith("test-token-123");
            expect(mockNavigation.navigate).toHaveBeenCalledWith("Home");
        });
    });

    it("displays error message when login fails", async () => {
        const errorMessage = "Invalid credentials";
        authApi.login.mockRejectedValueOnce(new Error(errorMessage));

        const { getByTestId } = render(
            <LoginScreen navigation={mockNavigation} />
        );

        const emailInput = getByTestId("emailInput");
        const passwordInput = getByTestId("passwordInput");
        const loginButton = getByTestId("loginButton");

        fireEvent.changeText(emailInput, "test@example.com");
        fireEvent.changeText(passwordInput, "wrongpassword");
        fireEvent.press(loginButton);

        await waitFor(() => {
            const errorElement = getByTestId("errorMessage");
            expect(errorElement).toBeTruthy();
            expect(errorElement.props.children).toBe(errorMessage);
        });
    });

    it("shows loading indicator during login", async () => {
        authApi.login.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve({ access_token: "token" }), 100)
                )
        );

        const { getByTestId, queryByTestId } = render(
            <LoginScreen navigation={mockNavigation} />
        );

        const emailInput = getByTestId("emailInput");
        const passwordInput = getByTestId("passwordInput");
        const loginButton = getByTestId("loginButton");

        fireEvent.changeText(emailInput, "test@example.com");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.press(loginButton);

        // Should show loading indicator
        await waitFor(() => {
            expect(getByTestId("loadingIndicator")).toBeTruthy();
        });

        // Should hide loading indicator after completion
        await waitFor(() => {
            expect(queryByTestId("loadingIndicator")).toBeNull();
        });
    });

    it("disables inputs during login", async () => {
        authApi.login.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve({ access_token: "token" }), 100)
                )
        );

        const { getByTestId } = render(
            <LoginScreen navigation={mockNavigation} />
        );

        const emailInput = getByTestId("emailInput");
        const passwordInput = getByTestId("passwordInput");
        const loginButton = getByTestId("loginButton");

        fireEvent.changeText(emailInput, "test@example.com");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.press(loginButton);

        // Should disable inputs during loading
        await waitFor(() => {
            expect(emailInput.props.editable).toBe(false);
            expect(passwordInput.props.editable).toBe(false);
        });
    });
});
