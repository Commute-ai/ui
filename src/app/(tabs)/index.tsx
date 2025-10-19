import { useContext, useState } from "react";

import { Text, View } from "react-native";

import { RouteForm } from "@/components/RouteForm";
import { RouteList, type Route } from "@/components/RouteList";

import { AuthContext } from "@/context/AuthContext";

export default function Home() {
    const auth = useContext(AuthContext);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    // This state controls the layout shift. It becomes true after the first search
    // and stays true, creating a stable layout.
    const [hasSearched, setHasSearched] = useState(false);

    const [routes, setRoutes] = useState<Route[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = () => {
        if (!from.trim() || !to.trim()) {
            // RouteForm shows an alert, so we just exit here.
            return;
        }

        // Trigger the layout shift only once
        if (!hasSearched) {
            setHasSearched(true);
        }

        // Start the search
        setIsLoading(true);
        setError(null);
        setRoutes([]);

        // Simulate API call
        setTimeout(() => {
            const mockApiRoutes = [
                {
                    id: "1",
                    duration: "25 min",
                    distance: "5.2 km",
                    departure: "10:30 AM",
                    transportModes: ["bus", "walk"],
                },
                {
                    id: "2",
                    duration: "35 min",
                    distance: "7.8 km",
                    departure: "10:45 AM",
                    transportModes: ["tram", "walk"],
                },
            ];
            setRoutes(mockApiRoutes);
            setIsLoading(false);
        }, 1500);
    };

    // When the user types, we just update the text and clear old results.
    // We no longer change the layout, which prevents focus loss.
    const handleFromChange = (text: string) => {
        setFrom(text);
        if (routes.length > 0 || error) {
            setRoutes([]);
            setError(null);
        }
    };

    const handleToChange = (text: string) => {
        setTo(text);
        if (routes.length > 0 || error) {
            setRoutes([]);
            setError(null);
        }
    };

    return (
        <View
            className={`flex-1 items-center ${
                hasSearched ? "justify-start pt-16" : "justify-center"
            }`}>
            <View className={`w-full items-center ${hasSearched ? "mb-4" : ""}`}>
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
                <RouteForm
                    from={from}
                    to={to}
                    onFromChange={handleFromChange}
                    onToChange={handleToChange}
                    onSearch={handleSearch}
                />
            </View>
            {/* After the first search, this View stays in the layout, 
                   preventing focus issues. The RouteList inside handles all states 
                   (loading, error, empty, or results). */}
            {hasSearched && (
                <View className="w-full flex-1">
                    <RouteList
                        routes={routes}
                        isLoading={isLoading}
                        error={error}
                    />
                </View>
            )}
        </View>
    );
}
