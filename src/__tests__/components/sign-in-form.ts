import React from "react";
import { fireEvent, render, waitFor, RenderAPI } from "@testing-library/react-native";
import LoginScreen from "../../components/Login";
import { AuthProvider } from "../../contexts/AuthContext";
import { authApi } from "../../api";
import storage from "../../utils/storage";

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
interface MockNavigation {
    navigate: jest.Mock;
}

const mockNavigation: MockNavigation = {
    navigate: jest.fn(),
};

describe("LoginScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (storage.getToken as jest.Mock).mockResolvedValue(null);
    });

    it("renders correctly and displays essential elements", async () => {
        const { findByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation as any} />
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
                <LoginScreen navigation={mockNavigation as any} />
            </AuthProvider>
        );
        const loginButton = await findByTestId("loginButton");
        fireEvent.press(loginButton);

        expect(await findByTestId("errorMessage")).toBeTruthy();
    });

    it("shows validation error when password is empty", async () => {
        const { findByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation as any} />
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
        (authApi.login as jest.Mock).mockResolvedValueOnce(mockResponse);

        const { findByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation as any} />
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
        (authApi.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const { findByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation as any} />
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
        (authApi.login as jest.Mock).mockImplementation(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve({ access_token: "token" }), 100)
                )
        );

        const { findByTestId, queryByTestId, findByPlaceholderText } = render(
            <AuthProvider>
                <LoginScreen navigation={mockNavigation as any} />
            </AuthProvider>
        );

        const usernameInput = await findByPlaceholderText("Username");
        const passwordInput = await findByPlaceholderText("Password");
        const loginButton = await findByTestId("loginButton");

        fireEvent.changeText(usernameInput, "testuser");
        fireEvent.changeText(passwordInput, "password123");
        fireEvent.press(loginButton);

        // Check for loading indicator
        await waitFor(() => {
            expect(queryByTestId("loadingIndicator")).toBeTruthy();
        });

        // Wait for login to complete
        await waitFor(() => {
            expect(mockNavigation.navigate).toHaveBeenCalled();
        });
    });
});
