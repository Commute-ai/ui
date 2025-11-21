import { useCallback, useEffect, useState } from "react";

import { MapPin, Plus, X } from "lucide-react-native";
import { TextInput, TouchableOpacity, View } from "react-native";

import preferencesApi from "@/lib/api/preferences";
import { useLocationService } from "@/lib/location";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { PlaceInput } from "./routing/PlaceInput";
import { Coordinates } from "@/types/geo";
import { RoutePreferences } from "@/types/preferences";

const getRouteKey = (from: Coordinates, to: Coordinates) =>
    `${from.latitude},${from.longitude},${to.latitude},${to.longitude}`;

export default function RouteSpecificPreferences() {
    const { getSuggestions, isValidPlace } = useLocationService();
    const [routesWithPreferences, setRoutesWithPreferences] = useState<
        RoutePreferences[]
    >([]);
    const [newPreferenceTexts, setNewPreferenceTexts] = useState<
        Record<string, string>
    >({});
    const [isAddingNewRoute, setIsAddingNewRoute] = useState(false);
    const [newRouteFrom, setNewRouteFrom] = useState("");
    const [newRouteTo, setNewRouteTo] = useState("");
    const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
    const [toSuggestions, setToSuggestions] = useState<string[]>([]);

    const fetchRoutesWithPreferences = useCallback(async () => {
        try {
            const data = await preferencesApi.getRoutePreferences();
            setRoutesWithPreferences(data);
        } catch (error) {
            // In a real app, handle this error
            console.error("Failed to fetch preferences:", error);
        }
    }, []);

    useEffect(() => {
        fetchRoutesWithPreferences();
    }, [fetchRoutesWithPreferences]);

    const handleFromChange = async (text: string) => {
        setNewRouteFrom(text);
        if (text.trim().length > 0) {
            const suggestions = await getSuggestions(text);
            setFromSuggestions(
                suggestions.map((p) => p.name).filter((n): n is string => !!n)
            );
        } else {
            setFromSuggestions([]);
        }
    };

    const handleToChange = async (text: string) => {
        setNewRouteTo(text);
        if (text.trim().length > 0) {
            const suggestions = await getSuggestions(text);
            setToSuggestions(
                suggestions.map((p) => p.name).filter((n): n is string => !!n)
            );
        } else {
            setToSuggestions([]);
        }
    };

    const onFromSuggestionPress = (placeName: string) => {
        setNewRouteFrom(placeName);
        setFromSuggestions([]);
    };

    const onToSuggestionPress = (placeName: string) => {
        setNewRouteTo(placeName);
        setToSuggestions([]);
    };

    const handleAddRoutePreference = useCallback(
        async (routePrefs: RoutePreferences) => {
            const routeKey = getRouteKey(
                routePrefs.from.coordinates,
                routePrefs.to.coordinates
            );
            const prompt = newPreferenceTexts[routeKey]?.trim();
            if (!prompt) return;

            const newPref = await preferencesApi.addRoutePreference(
                routePrefs.from.coordinates,
                routePrefs.to.coordinates,
                prompt
            );

            setRoutesWithPreferences((prev) =>
                prev.map((r) =>
                    getRouteKey(r.from.coordinates, r.to.coordinates) ===
                    routeKey
                        ? {
                              ...r,
                              preferences: [...r.preferences, newPref],
                          }
                        : r
                )
            );
            setNewPreferenceTexts((prev) => ({ ...prev, [routeKey]: "" }));
        },
        [newPreferenceTexts]
    );

    const handleDeleteRoutePreference = useCallback(
        async (routePrefs: RoutePreferences, preferenceId: number) => {
            await preferencesApi.deleteRoutePreference(preferenceId);
            const routeKey = getRouteKey(
                routePrefs.from.coordinates,
                routePrefs.to.coordinates
            );
            setRoutesWithPreferences((prev) =>
                prev.map((r) =>
                    getRouteKey(r.from.coordinates, r.to.coordinates) ===
                    routeKey
                        ? {
                              ...r,
                              preferences: r.preferences.filter(
                                  (p) => p.id !== preferenceId
                              ),
                          }
                        : r
                )
            );
        },
        []
    );

    const handleAddNewRoute = async () => {
        const fromName = newRouteFrom.trim();
        const toName = newRouteTo.trim();
        if (!fromName || !toName) return;

        if (!isValidPlace(fromName) || !isValidPlace(toName)) {
            // In a real app, you would show an error message to the user
            console.warn("Invalid place name provided");
            return;
        }

        // Get coordinates for the places
        const fromSuggestions = await getSuggestions(fromName);
        const toSuggestions = await getSuggestions(toName);

        const fromPlace = fromSuggestions.find((p) => p.name === fromName);
        const toPlace = toSuggestions.find((p) => p.name === toName);

        if (!fromPlace || !toPlace) {
            console.warn("Could not find coordinates for the places");
            return;
        }

        // Add new empty route to state
        const newRoute: RoutePreferences = {
            from: {
                coordinates: fromPlace.coordinates,
                name: fromName,
            },
            to: {
                coordinates: toPlace.coordinates,
                name: toName,
            },
            preferences: [],
        };

        setRoutesWithPreferences((prev) => [...prev, newRoute]);
        setNewRouteFrom("");
        setNewRouteTo("");
        setFromSuggestions([]);
        setToSuggestions([]);
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
                {routesWithPreferences.map((routePrefs) => {
                    const routeKey = getRouteKey(
                        routePrefs.from.coordinates,
                        routePrefs.to.coordinates
                    );
                    return (
                        <View
                            key={routeKey}
                            testID={`route-preferences-${routeKey}`}
                            className="rounded-lg border border-border bg-card p-4 shadow-sm"
                        >
                            <View className="mb-3 flex flex-row items-center gap-2">
                                <MapPin className="h-4 w-4 text-teal-600" />
                                <View className="flex flex-row items-center gap-2 text-sm font-medium">
                                    <Text className="text-foreground">
                                        {routePrefs.from.name}
                                    </Text>
                                    <Text className="text-muted-foreground">
                                        →
                                    </Text>
                                    <Text className="text-foreground">
                                        {routePrefs.to.name}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex flex-row flex-wrap items-start gap-2">
                                {routePrefs.preferences.map((pref) => (
                                    <View
                                        key={pref.id}
                                        className="shrink flex-row items-center gap-2 rounded-full border border-teal-200 bg-teal-100 px-3 py-1.5"
                                    >
                                        <View className="shrink">
                                            <Text className="text-sm text-teal-900">
                                                {pref.prompt}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            testID={`delete-preference-${routeKey}-${pref.id}`}
                                            onPress={() =>
                                                handleDeleteRoutePreference(
                                                    routePrefs,
                                                    pref.id
                                                )
                                            }
                                        >
                                            <X className="h-3 w-3 text-teal-900" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            <View className="mt-4 flex-row items-center gap-2">
                                <TextInput
                                    testID={`add-preference-input-${routeKey}`}
                                    placeholder="Add a new preference..."
                                    value={newPreferenceTexts[routeKey] || ""}
                                    onChangeText={(text) =>
                                        setNewPreferenceTexts((prev) => ({
                                            ...prev,
                                            [routeKey]: text,
                                        }))
                                    }
                                    className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                                />
                                <Button
                                    testID={`add-preference-button-${routeKey}`}
                                    size="sm"
                                    onPress={() =>
                                        handleAddRoutePreference(routePrefs)
                                    }
                                    disabled={
                                        !newPreferenceTexts[routeKey]?.trim()
                                    }
                                >
                                    <Plus className="h-4 w-4 text-primary-foreground" />
                                </Button>
                            </View>
                        </View>
                    );
                })}
            </View>

            {isAddingNewRoute ? (
                <View className="mt-4 rounded-lg border border-border bg-card p-4 shadow-sm">
                    <View className="mb-3 space-y-2">
                        <PlaceInput
                            testID="new-route-from-input"
                            placeholder="From"
                            value={newRouteFrom}
                            onChangeText={handleFromChange}
                            suggestions={fromSuggestions}
                            onSuggestionPress={onFromSuggestionPress}
                        />
                        <PlaceInput
                            testID="new-route-to-input"
                            placeholder="To"
                            value={newRouteTo}
                            onChangeText={handleToChange}
                            suggestions={toSuggestions}
                            onSuggestionPress={onToSuggestionPress}
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
