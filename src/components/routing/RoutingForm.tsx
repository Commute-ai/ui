import React from "react";

import { MapPin, Navigation, Search } from "lucide-react-native";
import { View } from "react-native";

import { showAlert } from "@/lib/alert";
import { useLocationService } from "@/lib/location";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { PlaceInput } from "./PlaceInput";

export function RoutingForm({
    from,
    to,
    onFromChange,
    onToChange,
    onSearch,
}: {
    from: string;
    to: string;
    onFromChange: (text: string) => void;
    onToChange: (text: string) => void;
    onSearch: () => void;
}) {
    const { getSuggestions, isValidPlace, getCurrentLocation } =
        useLocationService();
    const [fromSuggestions, setFromSuggestions] = React.useState<string[]>([]);
    const [toSuggestions, setToSuggestions] = React.useState<string[]>([]);

    const handleFromChange = async (text: string) => {
        onFromChange(text);
        if (text.length > 0) {
            const suggestions = await getSuggestions(text);
            setFromSuggestions(
                suggestions
                    .map((place) => place.name)
                    .filter(
                        (name): name is string =>
                            name !== null && name !== undefined
                    )
            );
        } else {
            setFromSuggestions([]);
        }
    };

    const handleToChange = async (text: string) => {
        onToChange(text);
        if (text.length > 0) {
            const suggestions = await getSuggestions(text);
            setToSuggestions(
                suggestions
                    .map((place) => place.name)
                    .filter(
                        (name): name is string =>
                            name !== null && name !== undefined
                    )
            );
        } else {
            setToSuggestions([]);
        }
    };

    const onFromSuggestionPress = (place: string) => {
        onFromChange(place);
        setFromSuggestions([]);
    };

    const onToSuggestionPress = (place: string) => {
        onToChange(place);
        setToSuggestions([]);
    };

    const useCurrentLocation = async () => {
        const currentLocation = await getCurrentLocation();
        if (currentLocation && currentLocation.name) {
            onFromChange(currentLocation.name);
        }
    };

    const onSubmit = () => {
        if (!from.trim() || !to.trim()) {
            showAlert(
                "Missing information",
                "Please fill in both 'From' and 'To' fields."
            );
            return;
        }

        // Validate that the inputs are valid places
        if (!isValidPlace(from)) {
            showAlert(
                "Invalid location",
                "Please select a valid location from the suggestions for 'From' field."
            );
            return;
        }

        if (!isValidPlace(to)) {
            showAlert(
                "Invalid location",
                "Please select a valid location from the suggestions for 'To' field."
            );
            return;
        }

        onSearch();
    };

    return (
        <View className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
            {/* Origin Input */}
            <View className="py--2">
                <View className="flex flex-row items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <Text className="text-sm font-medium text-foreground">
                        From
                    </Text>
                </View>
                <PlaceInput
                    placeholder="Enter origin (e.g., Exactum)"
                    value={from}
                    onChangeText={handleFromChange}
                    suggestions={fromSuggestions}
                    onSuggestionPress={onFromSuggestionPress}
                    showHereButton={true}
                    onHerePress={useCurrentLocation}
                />
            </View>

            {/* Destination Input */}
            <View className="py-2">
                <View className="flex flex-row items-center gap-2">
                    <Navigation className="h-4 w-4 text-accent" />
                    <Text className="text-sm font-medium text-foreground">
                        To
                    </Text>
                </View>
                <PlaceInput
                    placeholder="Enter destination (e.g., Kamppi)"
                    value={to}
                    onChangeText={handleToChange}
                    suggestions={toSuggestions}
                    onSuggestionPress={onToSuggestionPress}
                />
            </View>

            {/* Search Button */}
            <Button
                onPress={onSubmit}
                disabled={!from || !to}
                className="mt-2 h-12 w-full bg-primary"
            >
                <Search className="mr-2 h-5 w-5" />
                <Text className="text-primary-foreground">Search routes</Text>
            </Button>
        </View>
    );
}
