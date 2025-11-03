import { useContext, useState } from "react";

import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { RoutingForm } from "@/components/routing/RoutingForm";

import { AuthContext } from "@/context/AuthContext";
import { useRouteSearch } from "@/context/RouteSearchContext";

export default function Home() {
    const auth = useContext(AuthContext);
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

    return (
        <View className="flex-1 items-center justify-center">
            <View className="w-full items-center">
                {auth?.user ? (
                    <Text className="mb-4 text-lg">
                        Hello, {auth.user.username}!
                    </Text>
                ) : (
                    <Text className="mb-4 text-lg">Hello!</Text>
                )}
                <Text className="mb-4 text-2xl font-bold">
                    Plan a new route
                </Text>
                <RoutingForm
                    from={from}
                    to={to}
                    onFromChange={handleFromChange}
                    onToChange={handleToChange}
                    onSearch={handleSearch}
                />
            </View>
        </View>
    );
}
