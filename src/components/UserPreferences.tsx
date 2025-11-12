import React, { useEffect, useState } from "react";

import { Plus, X } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import preferencesApi, { type Preference } from "@/lib/api/preferences";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

const UserPreferences = () => {
    const { isLoaded } = useAuth();
    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [newPreference, setNewPreference] = useState("");

    useEffect(() => {
        const fetchPreferences = async () => {
            // Wait for the AuthContext to be fully loaded before fetching data
            if (isLoaded) {
                try {
                    const fetchedPreferences =
                        await preferencesApi.getPreferences();
                    setPreferences(fetchedPreferences);
                } catch (error) {
                    console.error("Failed to fetch preferences:", error);
                }
            }
        };

        fetchPreferences();
    }, [isLoaded]);

    const handleAddPreference = async () => {
        if (newPreference.trim()) {
            try {
                const addedPreference = await preferencesApi.addPreference(
                    newPreference.trim()
                );
                setPreferences([...preferences, addedPreference]);
                setNewPreference("");
            } catch (error) {
                console.error("Failed to add preference:", error);
            }
        }
    };

    const handleRemovePreference = async (preferenceId: number) => {
        try {
            await preferencesApi.deletePreference(preferenceId);
            setPreferences(preferences.filter((p) => p.id !== preferenceId));
        } catch (error) {
            console.error("Failed to delete preference:", error);
        }
    };

    return (
        <View className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <Text className="mb-2 text-base font-semibold text-foreground">
                Global Preferences
            </Text>
            <Text className="mb-4 text-sm text-muted-foreground">
                These are preferences for all your routes. AI will use these to
                personalize your journey recommendations.
            </Text>

            <View className="mb-4 flex flex-row flex-wrap items-start gap-2">
                {preferences.map((pref) => (
                    <View
                        key={pref.id}
                        className="shrink flex-row items-center gap-2 rounded-lg border border-purple-200 bg-purple-100 px-3 py-1.5"
                    >
                        <View className="shrink">
                            <Text className="text-sm text-purple-900">
                                {pref.prompt}
                            </Text>
                        </View>
                        <TouchableOpacity
                            testID={`remove-preference-${pref.id}`}
                            onPress={() => handleRemovePreference(pref.id)}
                            className="rounded-full p-0.5 transition-colors hover:bg-purple-200"
                        >
                            <X className="h-3 w-3 text-purple-900" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View className="flex flex-row gap-2">
                <Input
                    placeholder="Add a new preference..."
                    value={newPreference}
                    onChangeText={setNewPreference}
                    className="flex-1"
                />
                <Button
                    testID="add-preference-button"
                    onPress={handleAddPreference}
                    disabled={!newPreference.trim()}
                    size="icon"
                    className="flex-shrink-0 bg-purple-600 hover:bg-purple-700"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </View>
        </View>
    );
};

export default UserPreferences;
