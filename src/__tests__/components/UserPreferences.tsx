import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import preferencesApi from "@/lib/api/preferences";

import { useAuth } from "@/hooks/useAuth";

import UserPreferences from "@/components/UserPreferences";

import { type Preference } from "@/types/preferences";

jest.mock("@/hooks/useAuth");
jest.mock("@/lib/api/preferences");

const mockedUseAuth = useAuth as jest.Mock;
const mockedPreferencesApi = preferencesApi as jest.Mocked<
    typeof preferencesApi
>;

const mockPreferences: Preference[] = [
    {
        id: 1,
        prompt: "I prefer scenic routes",
        created_at: new Date().toISOString(),
        updated_at: null,
    },
    {
        id: 2,
        prompt: "Avoid highways",
        created_at: new Date().toISOString(),
        updated_at: null,
    },
];

describe("UserPreferences component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseAuth.mockReturnValue({ isLoaded: true });
        mockedPreferencesApi.getPreferences.mockResolvedValue(mockPreferences);
    });

    it("should render and fetch preferences", async () => {
        const { getByText, findByText } = render(<UserPreferences />);

        expect(getByText("Global Preferences")).toBeTruthy();
        expect(mockedPreferencesApi.getPreferences).toHaveBeenCalled();

        for (const pref of mockPreferences) {
            expect(await findByText(pref.prompt)).toBeTruthy();
        }
    });

    it("should add a new preference", async () => {
        const newPreference: Preference = {
            id: 3,
            prompt: "I like coffee shops",
            created_at: new Date().toISOString(),
            updated_at: null,
        };
        mockedPreferencesApi.addPreference.mockResolvedValue(newPreference);

        const { getByPlaceholderText, getByTestId, findByText } = render(
            <UserPreferences />
        );

        const input = getByPlaceholderText("Add a new preference...");
        fireEvent.changeText(input, newPreference.prompt);

        const addButton = getByTestId("add-preference-button");
        fireEvent.press(addButton);

        await waitFor(() => {
            expect(mockedPreferencesApi.addPreference).toHaveBeenCalledWith(
                newPreference.prompt
            );
        });

        expect(await findByText(newPreference.prompt)).toBeTruthy();
    });

    it("should remove a preference", async () => {
        const preferenceToRemove = mockPreferences[0];
        mockedPreferencesApi.deletePreference.mockResolvedValue(undefined);

        const { getByTestId, queryByText } = render(<UserPreferences />);

        await waitFor(() => {
            expect(
                getByTestId(`remove-preference-${preferenceToRemove.id}`)
            ).toBeTruthy();
        });

        const removeButton = getByTestId(
            `remove-preference-${preferenceToRemove.id}`
        );
        fireEvent.press(removeButton);

        await waitFor(() => {
            expect(mockedPreferencesApi.deletePreference).toHaveBeenCalledWith(
                preferenceToRemove.id
            );
        });

        expect(queryByText(preferenceToRemove.prompt)).toBeNull();
    });

    it("should not fetch preferences if auth is not loaded", () => {
        mockedUseAuth.mockReturnValue({ isLoaded: false });
        render(<UserPreferences />);
        expect(mockedPreferencesApi.getPreferences).not.toHaveBeenCalled();
    });
});
