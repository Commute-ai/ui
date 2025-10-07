import UserProfileHeader from "../../components/UserProfileHeader";

import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render } from "@testing-library/react-native";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}));

const renderWithNavigation = (component) => {
    return render(<NavigationContainer>{component}</NavigationContainer>);
};

describe("UserProfileHeader", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders a loading indicator when loading", () => {
        const { getByTestId } = renderWithNavigation(
            <UserProfileHeader isLoading={true} />
        );
        const activityIndicator = getByTestId("activity-indicator");
        expect(activityIndicator).toBeTruthy();
    });

    it("renders user information when data is provided", () => {
        const user = { username: "Test User" };
        const { getByText } = renderWithNavigation(
            <UserProfileHeader user={user} isLoading={false} />
        );
        const username = getByText("Test User");
        const status = getByText("Logged in");
        expect(username).toBeTruthy();
        expect(status).toBeTruthy();
    });

    it("renders an error message when an error occurs", () => {
        const { getByText } = renderWithNavigation(
            <UserProfileHeader error="Failed to load" isLoading={false} />
        );
        const errorMessage = getByText("Failed to load");
        expect(errorMessage).toBeTruthy();
    });

    it("renders nothing when no user is provided and not loading", () => {
        const { queryByTestId } = renderWithNavigation(
            <UserProfileHeader user={null} isLoading={false} />
        );
        const activityIndicator = queryByTestId("activity-indicator");
        expect(activityIndicator).toBeNull();
    });

    it("navigates to Profile screen on press", () => {
        const user = { username: "Test User" };
        const { getByText } = renderWithNavigation(
            <UserProfileHeader user={user} isLoading={false} />
        );

        fireEvent.press(getByText("Test User"));
        expect(mockNavigate).toHaveBeenCalledWith("Profile");
    });

    it("renders the avatar when a user is provided", () => {
        const user = { username: "Test User" };
        const { getByTestId } = renderWithNavigation(
            <UserProfileHeader user={user} isLoading={false} />
        );
        const avatar = getByTestId("avatar");
        expect(avatar).toBeTruthy();
    });
});
