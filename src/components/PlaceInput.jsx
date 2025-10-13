import {Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";

//TODO: Map selection
//TODO: Input validation and errors
export function PlaceInput({
                               placeholder,
                               value,
                               onChangeText,
                               suggestions,
                               onSuggestionPress,
                               showHereButton,
                               onHerePress
                           }) {
    const renderSuggestion = ({item}) => (
        <TouchableOpacity onPress={() => onSuggestionPress(item)}>
            <Text style={styles.suggestion}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={showHereButton ? styles.inputWithButton : styles.input}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                />
                {showHereButton && (
                    <View style={styles.buttonContainer}>
                        <Button title="Here" onPress={onHerePress}/>
                    </View>
                )}
            </View>
            <View style={styles.suggestionsContainer}>
                {suggestions.length > 0 && (
                    <FlatList
                        data={suggestions}
                        renderItem={renderSuggestion}
                        keyExtractor={item => item}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        justifyContent: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        marginRight: 5
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    inputWithButton: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 80, // Space for the button
        backgroundColor: 'white',
    },
    suggestionsContainer: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderTopWidth: 0,
        marginBottom: 10,
    },
    suggestion: {
        padding: 10,
    }
});
