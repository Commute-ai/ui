import apiClient from "@/lib/api/client";
import preferencesApi from "@/lib/api/preferences";

import { ApiError } from "@/types/api";
import { Preference } from "@/types/preferences";

jest.mock("@/lib/api/client");

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("preferencesApi", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getPreferences", () => {
        it("should return preferences on successful fetch", async () => {
            const mockPreferences: Preference[] = [
                {
                    id: 1,
                    prompt: "Test prompt 1",
                    created_at: new Date().toISOString(),
                    updated_at: null,
                },
                {
                    id: 2,
                    prompt: "Test prompt 2",
                    created_at: new Date().toISOString(),
                    updated_at: null,
                },
            ];

            mockedApiClient.get.mockResolvedValue(mockPreferences);

            const preferences = await preferencesApi.getPreferences();

            expect(preferences).toEqual(mockPreferences);
            expect(mockedApiClient.get).toHaveBeenCalledWith(
                "/users/preferences",
                {},
                expect.any(Object)
            );
        });

        it("should throw an ApiError when validation fails", async () => {
            const apiError = new ApiError(
                "Invalid response format from server",
                "VALIDATION_ERROR"
            );
            mockedApiClient.get.mockRejectedValue(apiError);

            await expect(preferencesApi.getPreferences()).rejects.toEqual(
                apiError
            );
        });
    });

    describe("addPreference", () => {
        it("should return the new preference on successful addition", async () => {
            const newPrompt = "New test prompt";
            const mockPreference: Preference = {
                id: 3,
                prompt: newPrompt,
                created_at: new Date().toISOString(),
                updated_at: null,
            };

            mockedApiClient.post.mockResolvedValue(mockPreference);

            const preference = await preferencesApi.addPreference(newPrompt);

            expect(preference).toEqual(mockPreference);
            expect(mockedApiClient.post).toHaveBeenCalledWith(
                "/users/preferences",
                { prompt: newPrompt },
                {},
                expect.any(Object)
            );
        });
    });

    describe("deletePreference", () => {
        it("should call delete on apiClient with the correct URL", async () => {
            const preferenceId = 1;
            mockedApiClient.delete.mockResolvedValue(undefined);

            await preferencesApi.deletePreference(preferenceId);

            expect(mockedApiClient.delete).toHaveBeenCalledWith(
                `/users/preferences/${preferenceId}`
            );
        });
    });
});
