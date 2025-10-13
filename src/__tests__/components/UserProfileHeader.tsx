import React from "react";

import { render } from "@testing-library/react-native";

import { useAuth } from "@/hooks/useAuth";

import UserProfileHeader from "@/components/UserProfileHeader";

import { User } from "@/types/user";

// Mock useAuth hook
jest.mock("@/hooks/useAuth");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockUser: User = { id: 1, username: "testuser" };

describe("UserProfileHeader", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders a loading indicator when loading", () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isLoaded: false,
            isSignedIn: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { getByTestId } = render(<UserProfileHeader />);
        const activityIndicator = getByTestId("activity-indicator");
        expect(activityIndicator).toBeTruthy();
    });

    it("does not render user information when loading", () => {
        mockUseAuth.mockReturnValue({
            user: mockUser,
            isLoaded: false,
            isSignedIn: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { queryByText } = render(<UserProfileHeader />);
        const username = queryByText("testuser");
        expect(username).toBeNull();
    });

    it("renders user information when data is provided", () => {
        mockUseAuth.mockReturnValue({
            user: mockUser,
            isLoaded: true,
            isSignedIn: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { getByText } = render(<UserProfileHeader />);
        const username = getByText("testuser");
        const status = getByText("Logged in");
        expect(username).toBeTruthy();
        expect(status).toBeTruthy();
    });

    it("renders nothing when no user is provided and not loading", () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isLoaded: true,
            isSignedIn: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { queryByTestId, queryByText } = render(<UserProfileHeader />);
        const activityIndicator = queryByTestId("activity-indicator");
        const loggedInText = queryByText("Logged in");

        expect(activityIndicator).toBeNull();
        expect(loggedInText).toBeNull();
    });

    it("renders the avatar when a user is provided", () => {
        mockUseAuth.mockReturnValue({
            user: mockUser,
            isLoaded: true,
            isSignedIn: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { getByTestId } = render(<UserProfileHeader />);
        const avatar = getByTestId("avatar");
        expect(avatar).toBeTruthy();
    });

    it("displays correct status text for logged in user", () => {
        mockUseAuth.mockReturnValue({
            user: mockUser,
            isLoaded: true,
            isSignedIn: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { getByText } = render(<UserProfileHeader />);
        const status = getByText("Logged in");
        expect(status).toBeTruthy();
    });

    it("renders card structure with proper content", () => {
        mockUseAuth.mockReturnValue({
            user: mockUser,
            isLoaded: true,
            isSignedIn: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { UNSAFE_root } = render(<UserProfileHeader />);

        // Verify the component renders without crashing
        expect(UNSAFE_root).toBeTruthy();
    });

    it("handles transition from loading to loaded with user", () => {
        mockUseAuth.mockReturnValue({
            user: null,
            isLoaded: false,
            isSignedIn: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        const { getByTestId, rerender } = render(<UserProfileHeader />);
        expect(getByTestId("activity-indicator")).toBeTruthy();

        // Simulate auth loading complete with user
        mockUseAuth.mockReturnValue({
            user: mockUser,
            isLoaded: true,
            isSignedIn: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getToken: jest.fn(),
        });

        rerender(<UserProfileHeader />);
        expect(getByTestId("avatar")).toBeTruthy();
    });
});
