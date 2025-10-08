import UserProfileHeader from "../../components/UserProfileHeader";

import React from "react";

import { render } from "@testing-library/react-native";

describe("UserProfileHeader", () => {
    it("renders a loading indicator when loading", () => {
        const { getByTestId } = render(<UserProfileHeader isLoading={true} />);
        const activityIndicator = getByTestId("activity-indicator");
        expect(activityIndicator).toBeTruthy();
    });

    it("renders user information when data is provided", () => {
        const user = { username: "Test User" };
        const { getByText } = render(
            <UserProfileHeader user={user} isLoading={false} />
        );
        const username = getByText("Test User");
        const status = getByText("Logged in");
        expect(username).toBeTruthy();
        expect(status).toBeTruthy();
    });

    it("renders an error message when an error occurs", () => {
        const { getByText } = render(
            <UserProfileHeader error="Failed to load" isLoading={false} />
        );
        const errorMessage = getByText("Failed to load");
        expect(errorMessage).toBeTruthy();
    });

    it("renders nothing when no user is provided and not loading", () => {
        const { queryByTestId } = render(
            <UserProfileHeader user={null} isLoading={false} />
        );
        const activityIndicator = queryByTestId("activity-indicator");
        expect(activityIndicator).toBeNull();
    });
});
