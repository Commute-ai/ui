import React from "react";

import {
    Button,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

//TODO: Map selection
//TODO: Input validation and errors

interface PlaceInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    suggestions: string[];
    onSuggestionPress: (suggestion: string) => void;
    showHereButton?: boolean;
    onHerePress?: () => void;
}

export function PlaceInput({
    placeholder,
    value,
    onChangeText,
    suggestions,
    onSuggestionPress,
    showHereButton,
    onHerePress,
}: PlaceInputProps) {
    const renderSuggestion = ({ item }: { item: string }) => (
        <TouchableOpacity onPress={() => onSuggestionPress(item)}>
            <Text className="p-2.5">{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <View className="justify-center">
                <TextInput
                    className={
                        showHereButton
                            ? "h-10 border border-gray-300 bg-white pl-2.5 pr-20"
                            : "h-10 border border-gray-300 bg-white px-2.5"
                    }
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                />
                {showHereButton && (
                    <View className="absolute bottom-0 right-0 top-0 mr-1.5 justify-center">
                        <Button title="Here" onPress={onHerePress} />
                    </View>
                )}
            </View>
            <View className="mb-2.5 h-24 border-x border-b border-gray-300">
                {suggestions.length > 0 && (
                    <FlatList
                        data={suggestions}
                        renderItem={renderSuggestion}
                        keyExtractor={(item) => item}
                    />
                )}
            </View>
        </View>
    );
}
