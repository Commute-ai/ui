import {Button, StyleSheet, View} from "react-native";
import React from "react";
import {PlaceInput} from "./PlaceInput";


//TODO: Fetch the places from somewhere once we get APIs going
const helsinkiPlaces = ["Kamppi", "Kallio", "Eira", "Helsinki", "Espoo", "Vantaa", "Kauniainen", "Helsingin Yliopisto", "Rautatatientori", "Pasila"];



export function RouteForm() {
    const [from, setFrom] = React.useState("");
    const [to, setTo] = React.useState("");
    const [fromSuggestions, setFromSuggestions] = React.useState([]);
    const [toSuggestions, setToSuggestions] = React.useState([]);

    const onFromChange = (text) => {
        setFrom(text);
        if (text.length > 0) {
            const regex = new RegExp(`^${text}`, 'i');
            setFromSuggestions(helsinkiPlaces.filter(place => regex.test(place)));
        } else {
            setFromSuggestions([]);
        }
    };

    const onToChange = (text) => {
        setTo(text);
        if (text.length > 0) {
            const regex = new RegExp(`^${text}`, 'i');
            setToSuggestions(helsinkiPlaces.filter(place => regex.test(place)));
        } else {
            setToSuggestions([]);
        }
    };

    const onFromSuggestionPress = (place) => {
        setFrom(place);
        setFromSuggestions([]);
    };

    const onToSuggestionPress = (place) => {
        setTo(place);
        setToSuggestions([]);
    };

    const onSubmit = () => {
        console.log(`Searching for a route from ${from} to ${to}`);
    };

    const useCurrentLocation = () => {
        setFrom("Kamppi");
    };

    return <View style={styles.container}>
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
        <Button title="Go!" onPress={onSubmit}/>
    </View>
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        marginVertical: 10,
    }
});
