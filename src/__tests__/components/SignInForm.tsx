import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { useAuth } from "@/hooks/useAuth";

import { SignInForm } from "@/components/SignInForm";

// Mock the useAuth hook
jest.mock("@/hooks/useAuth");

// Mock expo-router Link
jest.mock("expo-router", () => ({
    Link: ({ children }: { children: React.ReactNode }) => children,
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("SignInForm", () => {
    const mockSignIn = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            user: null,
            isLoaded: true,
            isSignedIn: false,
            signIn: mockSignIn,
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        })
    });

    it("renders correctly with all form elements", () => {
        const { getByText, getByPlaceholderText } = render(<SignInForm />);

        expect(getByText("Sign in to your app")).toBeTruthy();
        expect(
            getByText("Welcome back! Please sign in to continue")
        ).toBeTruthy();
        expect(getByPlaceholderText("Enter your username")).toBeTruthy();
        expect(getByText("Continue")).toBeTruthy();
    });

    it("updates username and password on text input", () => {
        const { getByTestId } = render(<SignInForm />);

        fireEvent.changeText(getByTestId("username-input"), "testuser");
        fireEvent.changeText(getByTestId("password-input"), "password123");

        expect(getByTestId("username-input").props.value).toBe("testuser");
        expect(getByTestId("password-input").props.value).toBe("password123");
    });

    it("calls signIn with correct credentials on submit", async () => {
        mockSignIn.mockResolvedValueOnce(undefined);

        const { getByTestId, getByText } = render(
            <SignInForm />
        );

        fireEvent.changeText(getByTestId("username-input"), "testuser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith("testuser", "password123");
        });
    });

    it("displays username error when sign in fails with username error", async () => {
        const error = new Error("Username not found");
        mockSignIn.mockRejectedValueOnce(error);

        const { getByTestId, getByText } = render(
            <SignInForm />
        );

        fireEvent.changeText(getByTestId("username-input"), "wronguser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(getByText("Username not found")).toBeTruthy();
        });
    });

    it("displays password error when sign in fails with password error", async () => {
        const error = new Error("Invalid credentials");
        mockSignIn.mockRejectedValueOnce(error);

        const { getByTestId, getByText } = render(
            <SignInForm />
        );
        fireEvent.changeText(getByTestId("username-input"), "testuser");
        fireEvent.changeText(getByTestId("password-input"), "wrongpassword");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(getByText("Invalid credentials")).toBeTruthy();
        });
    });

    it("displays generic error when sign in fails with unknown error", async () => {
        const error = { message: "Unknown error" };
        mockSignIn.mockRejectedValueOnce(error);

        // Mock console.error to avoid noise in tests
        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const { getByTestId, getByText } = render(
            <SignInForm />
        );

        fireEvent.changeText(getByTestId("username-input"), "testuser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(getByText("Sign in failed. Please try again.")).toBeTruthy();
        });

        consoleError.mockRestore();
    });

    it("shows loading indicator during sign in", async () => {
        mockSignIn.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100))
        );

        const { getByTestId, getByText, queryByText } =
            render(<SignInForm />);

        fireEvent.changeText(getByTestId("username-input"), "testuser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        // Should show loading and hide form
        await waitFor(() => {
            expect(queryByText("Continue")).toBeNull();
        });

        // Wait for completion
        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalled();
        });
    });

    it("does not submit when isLoaded is false", async () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isLoaded: false,
            isSignedIn: false,
            signIn: mockSignIn,
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { getByTestId, getByText } = render(<SignInForm />);

        fireEvent.changeText(getByTestId("username-input"), "testuser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));
        expect(mockSignIn).not.toHaveBeenCalled();
    });

    it("clears previous errors on new submission", async () => {
        const { getByTestId, getByText, queryByText } =
            render(<SignInForm />);

        // First submission with error
        mockSignIn.mockRejectedValueOnce(new Error("Invalid credentials"));

        fireEvent.changeText(getByTestId("username-input"), "testuser");
        fireEvent.changeText(getByTestId("password-input"), "wrongpass");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledTimes(1);
            expect(getByText("Invalid credentials")).toBeTruthy();
        });

        mockSignIn.mockResolvedValueOnce(undefined);
        fireEvent.changeText(getByTestId("password-input"), "correctpass");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledTimes(2);
            expect(queryByText("Invalid credentials")).toBeNull();
        });

    });
});
