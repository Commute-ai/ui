import {Button, FlatList, Text, TextInput, TouchableOpacity, View} from "react-native";
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
            <Text className="p-2.5">{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View>
            <View className="justify-center">
                <TextInput
                    className={showHereButton ? "h-10 border border-gray-300 bg-white pl-2.5 pr-20" : "h-10 border border-gray-300 bg-white px-2.5"}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                />
                {showHereButton && (
                    <View className="absolute right-0 top-0 bottom-0 justify-center mr-1.5">
                        <Button title="Here" onPress={onHerePress}/>
                    </View>
                )}
            </View>
            <View className="h-24 border-x border-b border-gray-300 mb-2.5">
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
