import { type ReactNode, createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { routesApi } from "@/lib/api/routes";
import { ApiError } from "@/types/api";
import { type Itinerary } from "@/types/routes";

interface RouteSearchContextType {
    routes: Itinerary[];
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
    const authContext = useContext(AuthContext);
    const [routes, setRoutes] = useState<Itinerary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchRoutes = async (from: string, to: string) => {
        if (!authContext) {
            setError("You must be logged in to search for routes.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setRoutes([]);

        try {
            const token = await authContext.getToken();
            if (!token) {
                setError("Authentication token is not available.");
                return;
            }
            const itineraries = await routesApi.searchRoutes(from, to, token);
            setRoutes(itineraries);
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred while searching for routes.");
            }
        } finally {
            setIsLoading(false);
        }
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
