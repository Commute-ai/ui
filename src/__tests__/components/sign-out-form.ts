import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Registration from "../../components/Registration";
import { authApi } from "../../api";

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
interface MockNavigation {
    navigate: jest.Mock;
}

const mockNavigation: MockNavigation = {
    navigate: jest.fn(),
};

describe("Registration Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders create account title, input fields, and buttons", async () => {
        const { findByText, findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation as any} />
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
            <Registration navigation={mockNavigation as any} />
        );

        const backButton = await findByText("Back to Login");
        fireEvent.press(backButton);

        expect(mockNavigation.navigate).toHaveBeenCalledWith("Login");
    });

    it("shows validation error if passwords don't match", async () => {
        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation as any} />
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
    });

    it("calls authApi.register with correct data and navigates on success", async () => {
        const mockResponse = { access_token: "new-token-456" };
        (authApi.register as jest.Mock).mockResolvedValueOnce(mockResponse);

        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation as any} />
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const confirmPasswordInput =
            await findByPlaceholderText("Confirm Password");
        const registerButton = await findByTestId("registerButton");

        fireEvent.changeText(usernameInput, "newuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.changeText(confirmPasswordInput, "password123");
        fireEvent.press(registerButton);

        await waitFor(() => {
            expect(authApi.register).toHaveBeenCalledWith(
                "newuser",
                "password123"
            );
            expect(mockNavigation.navigate).toHaveBeenCalledWith("Login");
        });
    });

    it("shows error message for server errors", async () => {
        const error = new Error("Server error. Please try again later.");
        (authApi.register as jest.Mock).mockRejectedValueOnce(error);

        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation as any} />
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
        (authApi.register as jest.Mock).mockRejectedValueOnce(error);

        const { findByPlaceholderText, findByTestId } = render(
            <Registration navigation={mockNavigation as any} />
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
        (authApi.register as jest.Mock).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve({ access_token: "token" }), 100)
                )
        );

        const { findByPlaceholderText, findByTestId, queryByTestId } = render(
            <Registration navigation={mockNavigation as any} />
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

        // Check for loading indicator
        await waitFor(() => {
            expect(queryByTestId("loadingIndicator")).toBeTruthy();
        });

        // Wait for registration to complete
        await waitFor(() => {
            expect(mockNavigation.navigate).toHaveBeenCalled();
        });
    });
});
