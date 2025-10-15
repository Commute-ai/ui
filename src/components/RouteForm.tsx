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

export function RouteForm() {
    const [from, setFrom] = React.useState("");
    const [to, setTo] = React.useState("");
    const [fromSuggestions, setFromSuggestions] = React.useState<string[]>([]);
    const [toSuggestions, setToSuggestions] = React.useState<string[]>([]);

    const onFromChange = (text: string) => {
        setFrom(text);
        if (text.length > 0) {
            const regex = new RegExp(`^${text}`, "i");
            setFromSuggestions(
                helsinkiPlaces.filter((place) => regex.test(place))
            );
        } else {
            setFromSuggestions([]);
        }
    };

    const onToChange = (text: string) => {
        setTo(text);
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
        setFrom(place);
        setFromSuggestions([]);
    };

    const onToSuggestionPress = (place: string) => {
        setTo(place);
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
        console.log(`Searching for a route from ${from} to ${to}`);
    };

    const useCurrentLocation = () => {
        setFrom("Kamppi");
    };

    return (
        <View className="my-2.5 w-4/5">
            <PlaceInput
                placeholder="From"
                value={from}
                onChangeText={onFromChange}
                suggestions={fromSuggestions}
                onSuggestionPress={onFromSuggestionPress}
                showHereButton={true}
                onHerePress={useCurrentLocation}
            />
            <PlaceInput
                placeholder="To"
                value={to}
                onChangeText={onToChange}
                suggestions={toSuggestions}
                onSuggestionPress={onToSuggestionPress}
            />
            <Button title="Go!" onPress={onSubmit} />
        </View>
    );
}
