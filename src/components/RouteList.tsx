"use client";

import React, { useState } from "react";

import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { RouteCard } from "@/components/RouteCard";

import { type Route } from "@/types/routes";

const RouteList = ({
    routes: routesProp = [],
    isLoading = false,
    error = null,
}: {
    routes: Route[];
    isLoading: boolean;
    error: string | null;
}) => {
    // Use the item's index to track the expanded route, as there's no stable ID.
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
                    Finding routes...
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
        setExpandedRouteIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const routes = Array.isArray(routesProp) ? routesProp : [];
    const validRoutes = routes.filter((r) => r && typeof r === "object");

    if (validRoutes.length === 0 && !isLoading) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-gray-500">
                    No routes found.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={validRoutes}
            renderItem={({ item, index }) => (
                <RouteCard
                    route={item}
                    isExpanded={expandedRouteIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View className="h-px bg-gray-300" />}
            className="p-4"
        />
    );
};

export { RouteList };
