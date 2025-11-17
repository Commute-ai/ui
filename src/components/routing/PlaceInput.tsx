import React, { useEffect, useRef, useState } from "react";

import { Portal } from "@rn-primitives/portal";
import { MapPin } from "lucide-react-native";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

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
    testID?: string;
}

export function PlaceInput({
    placeholder,
    value,
    onChangeText,
    suggestions,
    onSuggestionPress,
    showHereButton,
    onHerePress,
    testID,
}: PlaceInputProps) {
    const inputRef = useRef<TextInput>(null);
    const [inputLayout, setInputLayout] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const measureInput = () => {
        inputRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setInputLayout({ x: pageX, y: pageY, width, height });
        });
    };

    // Measure input position when suggestions appear
    useEffect(() => {
        if (suggestions.length > 0) {
            // Small delay to ensure layout is complete
            setTimeout(measureInput, 50);
        }
    }, [suggestions.length]);

    const renderSuggestion = ({ item }: { item: string }) => (
        <TouchableOpacity
            className="flex flex-row items-center gap-3 border-b border-border px-4 py-3 active:bg-muted"
            onPress={() => onSuggestionPress(item)}
        >
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Text className="text-foreground">{item}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <View className="relative">
                <View className="relative">
                    <TextInput
                        ref={inputRef}
                        className={
                            showHereButton
                                ? "h-12 rounded-md border border-input bg-background pl-4 pr-20 text-foreground shadow-sm shadow-black/5"
                                : "h-12 rounded-md border border-input bg-background px-4 text-foreground shadow-sm shadow-black/5"
                        }
                        onChangeText={onChangeText}
                        value={value}
                        placeholder={placeholder}
                        placeholderTextColor="#6B7280"
                        onFocus={measureInput}
                        onLayout={measureInput}
                        testID={testID}
                    />
                    {showHereButton && (
                        <View className="absolute inset-y-0 right-2 justify-center">
                            <Button
                                variant="secondary"
                                size="sm"
                                onPress={onHerePress}
                                className="h-8 px-3"
                            >
                                <Text className="text-xs font-medium text-primary">
                                    Here
                                </Text>
                            </Button>
                        </View>
                    )}
                </View>
            </View>

            {suggestions.length > 0 && (
                <Portal name="place-input-suggestions-portal">
                    <View
                        className="absolute rounded-lg border border-border bg-card shadow-lg"
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                            top: inputLayout.y + inputLayout.height + 4,
                            left: inputLayout.x,
                            width: inputLayout.width,
                            zIndex: 9999,
                            elevation: 10,
                        }}
                    >
                        <FlatList
                            data={suggestions}
                            renderItem={renderSuggestion}
                            keyExtractor={(item) => item}
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{ maxHeight: 200 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </Portal>
            )}
        </>
    );
}
