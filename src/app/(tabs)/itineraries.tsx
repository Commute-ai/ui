import { View } from "react-native";

import { ItineraryList } from "@/components/routing/ItineraryList";

import { useRouteSearch } from "@/context/RouteSearchContext";

export default function ItinerariesTab() {
    const { itineraries, isLoading, error } = useRouteSearch();

    return (
        <View className="flex-1">
            <ItineraryList
                itineraries={itineraries}
                isLoading={isLoading}
                error={error}
            />
        </View>
    );
}
