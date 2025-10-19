import { View } from "react-native";

import { RouteList } from "@/components/RouteList";

import { useRouteSearch } from "@/context/RouteSearchContext";

export default function RoutesTab() {
    const { routes, isLoading, error } = useRouteSearch();

    return (
        <View className="flex-1">
            <RouteList routes={routes} isLoading={isLoading} error={error} />
        </View>
    );
}
