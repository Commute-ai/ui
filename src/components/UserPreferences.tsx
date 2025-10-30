import React, { useState } from "react";

import { Plus, X } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

const UserPreferences = () => {
    const [preferences, setPreferences] = useState([
        "Prefer scenic routes",
        "Avoid full buses",
        "Minimize walking",
        "Prefer window seats",
    ]);
    const [newPreference, setNewPreference] = useState("");

    const handleAddPreference = () => {
        if (newPreference.trim()) {
            setPreferences([...preferences, newPreference.trim()]);
            setNewPreference("");
        }
    };

    const handleRemovePreference = (index: number) => {
        setPreferences(preferences.filter((_, i) => i !== index));
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
                {preferences.map((pref, index) => (
                    <View
                        key={index}
                        className="shrink flex-row items-center gap-2 rounded-lg border border-purple-200 bg-purple-100 px-3 py-1.5"
                    >
                        <View className="shrink">
                            <Text className="text-sm text-purple-900">
                                {pref}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => handleRemovePreference(index)}
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
