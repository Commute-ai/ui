"use client";

import React, { useState } from "react";

import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { ItineraryCard } from "@/components/routing/ItineraryCard";

import { type Itinerary } from "@/types/itinerary";

export const ItineraryList = ({
    itineraries = [],
    isLoading = false,
    error = null,
}: {
    itineraries: Itinerary[];
    isLoading: boolean;
    error: string | null;
}) => {
    const [expandedRouteIndex, setExpandedRouteIndex] = useState<number | null>(
        null
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <ActivityIndicator
                    size="large"
                    className="text-blue-500"
                    testID="activity-indicator"
                />
                <Text className="mt-2.5 text-base text-gray-500">
                    Finding itineraries...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-center text-base text-red-500">
                    {error}
                </Text>
            </View>
        );
    }

    const handleToggle = (index: number) => {
        setExpandedRouteIndex((prevIndex) =>
            prevIndex === index ? null : index
        );
    };

    if (itineraries.length === 0 && !isLoading) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-gray-500">
                    No itineraries found.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={itineraries}
            renderItem={({ item, index }) => (
                <ItineraryCard
                    itinerary={item}
                    isExpanded={expandedRouteIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            )}
            keyExtractor={(_, index) => index.toString()}
            ItemSeparatorComponent={() => <View className="h-px bg-gray-300" />}
            className="p-4"
        />
    );
};
