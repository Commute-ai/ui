import React from "react";

import { Button, View } from "react-native";

import { showAlert } from "@/lib/alert";

import { PlaceInput } from "./PlaceInput";

//TODO: Fetch the places from somewhere once we get APIs going
const helsinkiPlaces: string[] = [
    "Kamppi",
    "Kallio",
    "Eira",
    "Helsinki",
    "Espoo",
    "Vantaa",
    "Kauniainen",
    "Helsingin Yliopisto",
    "Rautatatientori",
    "Pasila",
];

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
    const [fromSuggestions, setFromSuggestions] = React.useState<string[]>([]);
    const [toSuggestions, setToSuggestions] = React.useState<string[]>([]);

    const handleFromChange = (text: string) => {
        onFromChange(text);
        if (text.length > 0) {
            const regex = new RegExp(`^${text}`, "i");
            setFromSuggestions(
                helsinkiPlaces.filter((place) => regex.test(place))
            );
        } else {
            setFromSuggestions([]);
        }
    };

    const handleToChange = (text: string) => {
        onToChange(text);
        if (text.length > 0) {
            const regex = new RegExp(`^${text}`, "i");
            setToSuggestions(
                helsinkiPlaces.filter((place) => regex.test(place))
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

    const onSubmit = () => {
        if (!from.trim() || !to.trim()) {
            showAlert(
                "Missing information",
                "Please fill in both 'From' and 'To' fields."
            );
            return;
        }
        onSearch();
    };

    const useCurrentLocation = () => {
        onFromChange("Kamppi");
    };

    return (
        <View className="my-2.5 w-4/5">
            <PlaceInput
                placeholder="From"
                value={from}
                onChangeText={handleFromChange}
                suggestions={fromSuggestions}
                onSuggestionPress={onFromSuggestionPress}
                showHereButton={true}
                onHerePress={useCurrentLocation}
            />
            <PlaceInput
                placeholder="To"
                value={to}
                onChangeText={handleToChange}
                suggestions={toSuggestions}
                onSuggestionPress={onToSuggestionPress}
            />
            <Button title="Go!" onPress={onSubmit} />
        </View>
    );
}
