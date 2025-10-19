import React from "react";

import {
    ActivityIndicator,
    FlatList,
    Text,
    View,
} from "react-native";

type Route = {
    id: string;
    transportModes: string[];
    duration: string;
    distance: string;
    departure: string;
};

const RouteCard = ({ route }: { route: Route }) => {
    if (!route) {
        return null;
    }

    console.log(route);

    return (
        <View className="mb-3 flex-row items-center justify-between rounded-lg bg-white p-4 shadow-md">
            <View className="flex-row items-center gap-4">
                {/* Icon rendering removed for debugging */}
                <View>
                    <Text className="text-lg font-bold text-gray-800">
                        {route.duration ?? 'N/A'}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        {route.distance ?? 'N/A'}
                    </Text>
                </View>
            </View>
            <View className="items-end">
                <Text className="text-xs text-gray-500">Departs</Text>
                <Text className="text-base font-bold text-gray-800">
                    {route.departure ?? 'N/A'}
                </Text>
            </View>
        </View>
    );
};

const RouteList = ({
    routes: routesProp = [],
    isLoading = false,
    error = null,
}: {
    routes: Route[];
    isLoading: boolean;
    error: string | null;
}) => {
    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <ActivityIndicator size="large" className="text-blue-500" />
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

    const routes = Array.isArray(routesProp) ? routesProp : [];
    const validRoutes = routes.filter((r) => r && typeof r === 'object');

    if (validRoutes.length === 0 && !isLoading) {
        return (
            <View className="flex-1 items-center justify-center p-5">
                <Text className="text-base text-gray-500">No routes found.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={validRoutes}
            renderItem={({ item }) => <RouteCard route={item} />}
            keyExtractor={(item, index) => (item?.id ?? index).toString()}
            className="p-4"
        />
    );
};

export { RouteList, Route };
