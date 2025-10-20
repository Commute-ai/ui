import React, { type ReactNode } from "react";

import { act, renderHook } from "@testing-library/react-native";

import {
    RouteSearchProvider,
    useRouteSearch,
} from "@/context/RouteSearchContext";

// Wrapper component that provides the context
const wrapper = ({ children }: { children: ReactNode }) => (
    <RouteSearchProvider>{children}</RouteSearchProvider>
);

describe("useRouteSearch", () => {
    it("throws an error when used outside of a RouteSearchProvider", () => {
        // Suppress console.error for this expected error
        const consoleError = console.error;
        console.error = jest.fn();

        expect(() => renderHook(() => useRouteSearch())).toThrow(
            "useRouteSearch must be used within a RouteSearchProvider"
        );

        console.error = consoleError;
    });

    it("initializes with default values", () => {
        const { result } = renderHook(() => useRouteSearch(), { wrapper });

        expect(result.current.routes).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it("updates state correctly when searching for routes", async () => {
        const { result } = renderHook(() => useRouteSearch(), { wrapper });

        // Initial state check
        expect(result.current.isLoading).toBe(false);

        // Start searching
        act(() => {
            result.current.searchRoutes("From", "To");
        });

        // Loading state
        expect(result.current.isLoading).toBe(true);

        // Wait for the simulated API call to finish
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1600)); // Wait a bit longer than the timeout in the context
        });

        // Final state
        expect(result.current.isLoading).toBe(false);
        expect(result.current.routes.length).toBe(3);
        expect(result.current.routes[0].id).toBe(1);
    });

    it("clears the search results", async () => {
        const { result } = renderHook(() => useRouteSearch(), { wrapper });

        // Search and wait for results
        act(() => {
            result.current.searchRoutes("From", "To");
        });
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1600));
        });

        // Check that we have routes
        expect(result.current.routes.length).toBeGreaterThan(0);

        // Clear the search
        act(() => {
            result.current.clearSearch();
        });

        // Check that routes are cleared
        expect(result.current.routes).toEqual([]);
        expect(result.current.error).toBeNull();
    });
});
