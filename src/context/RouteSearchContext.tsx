import { type ReactNode, createContext, useContext, useState } from "react";

import { type Route } from "@/types/routes";

interface RouteSearchContextType {
    routes: Route[];
    isLoading: boolean;
    error: string | null;
    searchRoutes: (from: string, to: string) => void;
    clearSearch: () => void;
}

export const RouteSearchContext = createContext<RouteSearchContextType | null>(
    null
);

export function useRouteSearch() {
    const context = useContext(RouteSearchContext);
    if (!context) {
        throw new Error(
            "useRouteSearch must be used within a RouteSearchProvider"
        );
    }
    return context;
}

export function RouteSearchProvider({ children }: { children: ReactNode }) {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchRoutes = (from: string, to: string) => {
        setIsLoading(true);
        setError(null);
        setRoutes([]);

        // Simulate API call
        setTimeout(() => {
            const mockApiRoutes: Route[] = [
                {
                    id: 1,
                    departureTime: "10:30",
                    arrivalTime: "10:57",
                    duration: 27,
                    legs: [
                        {
                            mode: "walk",
                            duration: 5,
                            distance: "400m",
                            from: "Your Location",
                            to: "Bus stop 1",
                        },
                        {
                            mode: "bus",
                            line: "506",
                            duration: 15,
                            from: "Viikki",
                            to: "Pasila",
                        },
                        {
                            mode: "walk",
                            duration: 7,
                            distance: "600m",
                            from: "Bus stop 2",
                            to: "Destination",
                        },
                    ],
                    aiMatch: 92,
                    aiReason:
                        "Best for you! This route is scenic and avoids crowded areas.",
                },
                {
                    id: 2,
                    departureTime: "10:45",
                    arrivalTime: "11:20",
                    duration: 35,
                    legs: [
                        {
                            mode: "walk",
                            duration: 8,
                            distance: "700m",
                            from: "Your Location",
                            to: "Tram stop A",
                        },
                        {
                            mode: "tram",
                            line: "7",
                            duration: 20,
                            from: "Otaniemi",
                            to: "Kamppi",
                        },
                        {
                            mode: "metro",
                            line: "M1",
                            duration: 5,
                            from: "Kamppi",
                            to: "Hakaniemi",
                        },
                        {
                            mode: "walk",
                            duration: 2,
                            distance: "200m",
                            from: "Hakaniemi metro",
                            to: "Destination",
                        },
                    ],
                    aiMatch: 81,
                    aiReason:
                        "Good alternative. A bit longer, but uses your preferred tram line.",
                },
                {
                    id: 3,
                    departureTime: "10:25",
                    arrivalTime: "11:15",
                    duration: 50,
                    legs: [
                        {
                            mode: "bus",
                            line: "57",
                            duration: 40,
                            from: "Munkkiniemi",
                            to: "Kontula",
                        },
                        {
                            mode: "walk",
                            duration: 10,
                            distance: "800m",
                            from: "Kontula bus stop",
                            to: "Destination",
                        },
                    ],
                    aiMatch: 65,
                    aiReason:
                        "Less ideal. Involves a long bus ride and significant walking.",
                },
            ];
            setRoutes(mockApiRoutes);
            setIsLoading(false);
        }, 1500);
    };

    const clearSearch = () => {
        setRoutes([]);
        setError(null);
    };

    return (
        <RouteSearchContext.Provider
            value={{ routes, isLoading, error, searchRoutes, clearSearch }}
        >
            {children}
        </RouteSearchContext.Provider>
    );
}
