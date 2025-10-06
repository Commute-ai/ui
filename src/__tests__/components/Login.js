import { authApi } from "../../api";
import LoginScreen from "../../components/Login";
import { AuthProvider } from "../../contexts/AuthContext";
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
        getToken: jest.fn(),
        removeToken: jest.fn(),
    },
}));

// Mock navigation prop
const mockNavigation = {
    navigate: jest.fn(),
};

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        storage.getToken.mockResolvedValue(null);
    });

    it("renders correctly and displays essential elements", async () => {
        const { findByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation} />
            </AuthProvider>
        );

        expect(await findByTestId("title")).toBeTruthy();
        expect(await findByPlaceholderText("Username")).toBeTruthy();
        expect(await findByPlaceholderText("Password")).toBeTruthy();
        expect(await findByTestId("loginButton")).toBeTruthy();
    });

    it("shows validation error when username is empty", async () => {
        const { findByTestId } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation} />
            </AuthProvider>
        );
        const loginButton = await findByTestId("loginButton");
        fireEvent.press(loginButton);

        expect(await findByTestId("errorMessage")).toBeTruthy();
    });

    it("shows validation error when password is empty", async () => {
        const { findByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation} />
            </AuthProvider>
        );
        const usernameInput = await findByPlaceholderText("Username");
        const loginButton = await findByTestId("loginButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.press(loginButton);

        expect(await findByTestId("errorMessage")).toBeTruthy();
    });

    it("calls authApi.login with correct credentials and navigates on success", async () => {
        const mockResponse = { access_token: "test-token-123" };
        authApi.login.mockResolvedValueOnce(mockResponse);

        const { findByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation} />
            </AuthProvider>
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const loginButton = await findByTestId("loginButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(authApi.login).toHaveBeenCalledWith(
                "testuser",
                "password123"
            );
            expect(storage.saveToken).toHaveBeenCalledWith("test-token-123");
            expect(mockNavigation.navigate).toHaveBeenCalledWith("Home");
        });
    });

    it("displays error message when login fails", async () => {
        const errorMessage = "Invalid credentials";
        authApi.login.mockRejectedValueOnce(new Error(errorMessage));

        const { findByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation} />
            </AuthProvider>
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const loginButton = await findByTestId("loginButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "wrongpassword");
        fireEvent.press(loginButton);

        await waitFor(async () => {
            const errorElement = await findByTestId("errorMessage");
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

        const { findByTestId, queryByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation} />
            </AuthProvider>
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const loginButton = await findByTestId("loginButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.press(loginButton);

        expect(await findByTestId("loadingIndicator")).toBeTruthy();

        await waitFor(
            () => {
                expect(queryByTestId("loadingIndicator")).toBeNull();
            },
            { timeout: 3000 }
        );
    });

    it("disables inputs during login", async () => {
        authApi.login.mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve({ access_token: "token" }), 100)
                )
        );

        const { findByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation} />
            </AuthProvider>
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const loginButton = await findByTestId("loginButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(usernameInput.props.editable).toBe(false);
            expect(passwordInput.props.editable).toBe(false);
        });
    });
});
