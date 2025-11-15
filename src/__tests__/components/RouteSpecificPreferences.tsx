import React from "react";

import {
    fireEvent,
    render,
    waitFor,
    within,
} from "@testing-library/react-native";

import RouteSpecificPreferences from "@/components/RouteSpecificPreferences";

describe("RouteSpecificPreferences component", () => {
    it("should render initial routes and preferences", async () => {
        const { findByTestId } = render(<RouteSpecificPreferences />);

        // Check for first route
        const route1 = await findByTestId("route-preferences-1");
        expect(within(route1).getByText("Exactum")).toBeTruthy();
        expect(within(route1).getByText("Kamppi")).toBeTruthy();
        expect(
            within(route1).getByText("Never use the tram for this route")
        ).toBeTruthy();
        expect(within(route1).getByText("Prefer bus 506")).toBeTruthy();
        expect(within(route1).getByText("Avoid rush hour metro")).toBeTruthy();

        // Check for second route
        const route2 = await findByTestId("route-preferences-2");
        expect(within(route2).getByText("Kamppi")).toBeTruthy();
        expect(within(route2).getByText("Pasila")).toBeTruthy();
        expect(
            within(route2).getByText("Always use metro when available")
        ).toBeTruthy();
        expect(
            within(route2).getByText("Avoid walking through Töölö")
        ).toBeTruthy();
    });

    it("should add a new preference to a route", async () => {
        const { getByTestId, findByText } = render(
            <RouteSpecificPreferences />
        );
        const newPreference = "Use a city bike";

        const input = getByTestId("add-preference-input-1");
        fireEvent.changeText(input, newPreference);

        const addButton = getByTestId("add-preference-button-1");
        fireEvent.press(addButton);

        expect(await findByText(newPreference)).toBeTruthy();
    });

    it("should delete a preference from a route", async () => {
        const { getByTestId, queryByText } = render(
            <RouteSpecificPreferences />
        );
        const preferenceToDelete = "Prefer bus 506";

        const deleteButton = getByTestId("delete-preference-1-1");
        fireEvent.press(deleteButton);

        await waitFor(() => {
            expect(queryByText(preferenceToDelete)).toBeNull();
        });
    });

    it("should add a new route", async () => {
        const { getByTestId, findByText, findByPlaceholderText } = render(
            <RouteSpecificPreferences />
        );

        const addNewRouteButton = getByTestId("add-new-route-button");
        fireEvent.press(addNewRouteButton);

        const fromInput = await findByPlaceholderText("From");
        const toInput = await findByPlaceholderText("To");
        const addRouteButton = getByTestId("add-route-button");

        fireEvent.changeText(fromInput, "Kumpula");
        fireEvent.changeText(toInput, "Herttoniemi");
        fireEvent.press(addRouteButton);

        expect(await findByText("Kumpula")).toBeTruthy();
        expect(await findByText("Herttoniemi")).toBeTruthy();
    });

    it("should cancel adding a new route", async () => {
        const { getByTestId, queryByPlaceholderText, findByTestId } = render(
            <RouteSpecificPreferences />
        );

        const addNewRouteButton = getByTestId("add-new-route-button");
        fireEvent.press(addNewRouteButton);

        const cancelButton = await findByTestId("cancel-add-route-button");
        fireEvent.press(cancelButton);

        await waitFor(() => {
            expect(queryByPlaceholderText("From")).toBeNull();
            expect(queryByPlaceholderText("To")).toBeNull();
        });
    });
});
