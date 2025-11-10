import { useState } from "react";

import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";

import { RecentSearches } from "@/components/routing/RecentSearches";
import { RoutingForm } from "@/components/routing/RoutingForm";

import { useRouteSearch } from "@/context/RouteSearchContext";

export default function Home() {
    const router = useRouter();
    const { itineraries, error, searchRoutes, clearSearch } = useRouteSearch();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const handleSearch = () => {
        if (!from.trim() || !to.trim()) {
            // RoutingForm shows an alert, so we just exit here.
            return;
        }

        searchRoutes(from, to);
        router.push("/itineraries");
    };

    const handleFromChange = (text: string) => {
        setFrom(text);
        if (itineraries.length > 0 || error) {
            clearSearch();
        }
    };

    const handleToChange = (text: string) => {
        setTo(text);
        if (itineraries.length > 0 || error) {
            clearSearch();
        }
    };

    const handleQuickSearch = (origin: string, destination: string) => {
        setFrom(origin);
        setTo(destination);
        if (itineraries.length > 0 || error) {
            clearSearch();
        }
    };

    return (
        <View className="flex-1 bg-background">
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerClassName="sm:flex-1 items-center justify-start p-4 py-8 sm:py-4 sm:p-6"
                keyboardDismissMode="interactive"
            >
                <View className="w-full max-w-2xl py-6">
                    {/* Welcome Section */}
                    <View className="py-2">
                        <Text className="text-2xl font-bold text-foreground">
                            Plan your journey
                        </Text>
                        <Text className="text-muted-foreground">
                            Find the best routes with AI-powered recommendations
                        </Text>
                    </View>

                    {/* Search Form */}
                    <RoutingForm
                        from={from}
                        to={to}
                        onFromChange={handleFromChange}
                        onToChange={handleToChange}
                        onSearch={handleSearch}
                    />

                    {/* Recent Searches */}
                    <RecentSearches onQuickSearch={handleQuickSearch} />
                </View>
            </ScrollView>
        </View>
    );
}
