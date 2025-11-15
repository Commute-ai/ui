import { useCallback, useEffect, useState } from "react";

import { MapPin, Plus, X } from "lucide-react-native";
import { TextInput, TouchableOpacity, View } from "react-native";

import preferencesApi, {
    Route,
    RouteWithPreferences,
} from "@/lib/api/preferences";
import { useLocationService } from "@/lib/location";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { PlaceInput } from "./routing/PlaceInput";

const getRouteKey = (route: Route) =>
    `${route.fromLat},${route.fromLon},${route.toLat},${route.toLon}`;

export default function RouteSpecificPreferences() {
    const { getSuggestions, isValidPlace } = useLocationService();
    const [routesWithPreferences, setRoutesWithPreferences] = useState<
        RouteWithPreferences[]
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
            const data = await preferencesApi.getRoutesWithPreferences();
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
        async (route: Route) => {
            const routeKey = getRouteKey(route);
            const prompt = newPreferenceTexts[routeKey]?.trim();
            if (!prompt) return;

            const newPref = await preferencesApi.addRouteSpecificPreference(
                route,
                {
                    prompt,
                }
            );

            setRoutesWithPreferences((prev) =>
                prev.map((r) =>
                    getRouteKey(r.route) === routeKey
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
        async (route: Route, preferenceId: number) => {
            await preferencesApi.deleteRouteSpecificPreference(
                route,
                preferenceId
            );
            const routeKey = getRouteKey(route);
            setRoutesWithPreferences((prev) =>
                prev.map((r) =>
                    getRouteKey(r.route) === routeKey
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

        await preferencesApi.addSavedRoute(fromName, toName);

        // Refetch the routes to get the updated list
        await fetchRoutesWithPreferences();

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
                {routesWithPreferences.map(({ route, preferences }) => {
                    const routeKey = getRouteKey(route);
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
                                        {route.from}
                                    </Text>
                                    <Text className="text-muted-foreground">
                                        →
                                    </Text>
                                    <Text className="text-foreground">
                                        {route.to}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex flex-row flex-wrap items-start gap-2">
                                {preferences.map((pref) => (
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
                                                    route,
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
                                        handleAddRoutePreference(route)
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
