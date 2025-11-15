import { useState } from "react";

import { MapPin, Plus, X } from "lucide-react-native";
import { TextInput, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { PlaceInput } from "./routing/PlaceInput";

export default function RouteSpecificPreferences() {
    const [specificRoutePreferences, setSpecificRoutePreferences] = useState([
        {
            id: 1,
            from: "Exactum",
            to: "Kamppi",
            preferences: [
                "Never use the tram for this route",
                "Prefer bus 506",
                "Avoid rush hour metro",
            ],
        },
        {
            id: 2,
            from: "Kamppi",
            to: "Pasila",
            preferences: [
                "Always use metro when available",
                "Avoid walking through Töölö",
            ],
        },
    ]);
    const [newPreferenceTexts, setNewPreferenceTexts] = useState<
        Record<number, string>
    >({});
    const [isAddingNewRoute, setIsAddingNewRoute] = useState(false);
    const [newRouteFrom, setNewRouteFrom] = useState("");
    const [newRouteTo, setNewRouteTo] = useState("");

    const handleAddRoutePreference = (routeId: number) => {
        const newPreference = newPreferenceTexts[routeId]?.trim();
        if (!newPreference) return;

        setSpecificRoutePreferences((prev) =>
            prev.map((route) =>
                route.id === routeId
                    ? {
                          ...route,
                          preferences: [...route.preferences, newPreference],
                      }
                    : route
            )
        );
        setNewPreferenceTexts((prev) => ({ ...prev, [routeId]: "" }));
    };

    const handleDeleteRoutePreference = (
        routeId: number,
        prefIndex: number
    ) => {
        setSpecificRoutePreferences((prev) =>
            prev.map((route) =>
                route.id === routeId
                    ? {
                          ...route,
                          preferences: route.preferences.filter(
                              (_, i) => i !== prefIndex
                          ),
                      }
                    : route
            )
        );
    };

    const handleAddNewRoute = () => {
        if (!newRouteFrom.trim() || !newRouteTo.trim()) return;

        const newRoute = {
            id: Date.now(), // Simple unique ID
            from: newRouteFrom.trim(),
            to: newRouteTo.trim(),
            preferences: [],
        };

        setSpecificRoutePreferences((prev) => [...prev, newRoute]);
        setNewRouteFrom("");
        setNewRouteTo("");
        setIsAddingNewRoute(false);
    };

    return (
        <View>
            <Text className="mb-3 text-base font-semibold text-foreground">
                Route-Specific Preferences
            </Text>
            <Text className="mb-4 text-sm text-muted-foreground">
                Set custom preferences for your frequent routes
            </Text>

            <View className="space-y-3">
                {specificRoutePreferences.map((route) => (
                    <View
                        key={route.id}
                        testID={`route-preferences-${route.id}`}
                        className="rounded-lg border border-border bg-card p-4 shadow-sm"
                    >
                        {/* Route Header */}
                        <View className="mb-3 flex flex-row items-center gap-2">
                            <MapPin className="h-4 w-4 text-teal-600" />
                            <View className="flex flex-row items-center gap-2 text-sm font-medium">
                                <Text className="text-foreground">
                                    {route.from}
                                </Text>
                                <Text className="text-muted-foreground">→</Text>
                                <Text className="text-foreground">
                                    {route.to}
                                </Text>
                            </View>
                        </View>

                        {/* Route Preferences */}
                        <View className="flex flex-row flex-wrap items-start gap-2">
                            {route.preferences.map((pref, index) => (
                                <View
                                    key={index}
                                    className="shrink flex-row items-center gap-2 rounded-full border border-teal-200 bg-teal-100 px-3 py-1.5"
                                >
                                    <View className="shrink">
                                        <Text className="text-sm text-teal-900">
                                            {pref}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        testID={`delete-preference-${route.id}-${index}`}
                                        onPress={() =>
                                            handleDeleteRoutePreference(
                                                route.id,
                                                index
                                            )
                                        }
                                    >
                                        <X className="h-3 w-3 text-teal-900" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {/* Add Preference Input */}
                        <View className="mt-4 flex-row items-center gap-2">
                            <TextInput
                                testID={`add-preference-input-${route.id}`}
                                placeholder="Add a new preference..."
                                value={newPreferenceTexts[route.id] || ""}
                                onChangeText={(text) =>
                                    setNewPreferenceTexts((prev) => ({
                                        ...prev,
                                        [route.id]: text,
                                    }))
                                }
                                className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                            />
                            <Button
                                testID={`add-preference-button-${route.id}`}
                                size="sm"
                                onPress={() =>
                                    handleAddRoutePreference(route.id)
                                }
                                disabled={!newPreferenceTexts[route.id]?.trim()}
                            >
                                <Plus className="h-4 w-4 text-primary-foreground" />
                            </Button>
                        </View>
                    </View>
                ))}
            </View>

            {/* Add New Route Section */}
            {isAddingNewRoute ? (
                <View className="mt-4 rounded-lg border border-border bg-card p-4 shadow-sm">
                    <View className="mb-3 space-y-2">
                        <PlaceInput
                            testID="new-route-from-input"
                            placeholder="From"
                            value={newRouteFrom}
                            onChangeText={setNewRouteFrom}
                            suggestions={[]}
                            onSuggestionPress={() => {}}
                        />
                        <PlaceInput
                            testID="new-route-to-input"
                            placeholder="To"
                            value={newRouteTo}
                            onChangeText={setNewRouteTo}
                            suggestions={[]}
                            onSuggestionPress={() => {}}
                        />
                    </View>
                    <View className="flex-row justify-end gap-2">
                        <Button
                            testID="cancel-add-route-button"
                            variant="ghost"
                            onPress={() => setIsAddingNewRoute(false)}
                        >
                            <Text>Cancel</Text>
                        </Button>
                        <Button
                            testID="add-route-button"
                            onPress={handleAddNewRoute}
                            disabled={
                                !newRouteFrom.trim() || !newRouteTo.trim()
                            }
                        >
                            <Text>Add Route</Text>
                        </Button>
                    </View>
                </View>
            ) : (
                <Button
                    testID="add-new-route-button"
                    variant="outline"
                    className="mt-4 w-full border-dashed bg-transparent"
                    onPress={() => setIsAddingNewRoute(true)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    <Text>Add new route preference</Text>
                </Button>
            )}
        </View>
    );
}
