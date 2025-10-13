import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { useAuth } from "@/hooks/useAuth";

import { SignUpForm } from "@/components/SignUpForm";

// Mock the useAuth hook
jest.mock("@/hooks/useAuth");

// Mock expo-router Link
jest.mock("expo-router", () => ({
    Link: ({ children }: { children: React.ReactNode }) => children,
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("SignUpForm", () => {
    const mockSignUp = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            user: null,
            isLoaded: true,
            isSignedIn: false,
            signIn: jest.fn(),
            signUp: mockSignUp,
            signOut: jest.fn(),
            getToken: jest.fn(),
        });
    });

    it("renders correctly with all form elements", () => {
        const { getByText, getByPlaceholderText } = render(<SignUpForm />);

        expect(getByText("Create your account")).toBeTruthy();
        expect(
            getByText("Welcome! Please fill in the details to get started.")
        ).toBeTruthy();
        expect(getByPlaceholderText("Please enter a username")).toBeTruthy();
        expect(getByText("Continue")).toBeTruthy();
    });

    it("updates username and password on text input", () => {
        const { getByTestId } = render(<SignUpForm />);

        fireEvent.changeText(getByTestId("username-input"), "newuser");
        fireEvent.changeText(getByTestId("password-input"), "password123");

        expect(getByTestId("username-input").props.value).toBe("newuser");
        expect(getByTestId("password-input").props.value).toBe("password123");
    });

    it("calls signUp with correct credentials on submit", async () => {
        mockSignUp.mockResolvedValueOnce(undefined);

        const { getByTestId, getByText } = render(<SignUpForm />);

        fireEvent.changeText(getByTestId("username-input"), "newuser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith("newuser", "password123");
        });
    });

    it("displays username error when sign up fails with username error", async () => {
        const error = new Error("Username already exists");
        mockSignUp.mockRejectedValueOnce(error);

        const { getByTestId, getByText } = render(<SignUpForm />);

        fireEvent.changeText(getByTestId("username-input"), "existinguser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(getByText("Username already exists")).toBeTruthy();
        });
    });

    it("displays password error when sign up fails with password error", async () => {
        const error = new Error("Password must be at least 8 characters");
        mockSignUp.mockRejectedValueOnce(error);

        const { getByTestId, getByText } = render(<SignUpForm />);

        fireEvent.changeText(getByTestId("username-input"), "newuser");
        fireEvent.changeText(getByTestId("password-input"), "short");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(
                getByText("Password must be at least 8 characters")
            ).toBeTruthy();
        });
    });

    it("displays generic error when sign up fails with unknown error", async () => {
        const error = { message: "Unknown error" };
        mockSignUp.mockRejectedValueOnce(error);

        // Mock console.error to avoid noise in tests
        const consoleError = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const { getByTestId, getByText } = render(<SignUpForm />);

        fireEvent.changeText(getByTestId("username-input"), "newuser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(getByText("Sign up failed. Please try again.")).toBeTruthy();
        });

        consoleError.mockRestore();
    });

    it("shows loading indicator during sign up", async () => {
        mockSignUp.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, 100))
        );

        const { getByTestId, getByText, queryByText } = render(<SignUpForm />);

        fireEvent.changeText(getByTestId("username-input"), "newuser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        // Should show loading and hide form
        await waitFor(() => {
            expect(queryByText("Continue")).toBeNull();
        });

        // Wait for completion
        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalled();
        });
    });

    it("does not submit when isLoaded is false", async () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isLoaded: false,
            isSignedIn: false,
            signIn: jest.fn(),
            signUp: mockSignUp,
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { getByTestId, getByText } = render(<SignUpForm />);

        fireEvent.changeText(getByTestId("username-input"), "existinguser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        expect(mockSignUp).not.toHaveBeenCalled();
    });

    it("clears previous errors on new submission", async () => {
        const { getByTestId, getByText, queryByText } = render(<SignUpForm />);

        // First submission with error
        mockSignUp.mockRejectedValueOnce(new Error("Username already exists"));

        fireEvent.changeText(getByTestId("username-input"), "existinguser");
        fireEvent.changeText(getByTestId("password-input"), "password123");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(getByText("Username already exists")).toBeTruthy();
        });

        // Second submission succeeds
        mockSignUp.mockResolvedValueOnce(undefined);

        fireEvent.changeText(getByTestId("username-input"), "newuser");
        fireEvent.press(getByText("Continue"));

        await waitFor(() => {
            expect(queryByText("Username already exists")).toBeNull();
        });
    });

    it("displays navigation link to sign in page", () => {
        const { queryByText } = render(<SignUpForm />);

        expect(queryByText(/Already have an account\?/)).toBeTruthy();
        expect(queryByText(/Sign in/)).toBeTruthy();
    });
});
