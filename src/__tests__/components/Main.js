import App from "../../../App";

import React from "react";

import { render } from "@testing-library/react-native";

describe("App", () => {
    it("renders the initial instruction text", () => {
        const { getByText } = render(<App />);
        expect(getByText("Welcome to the App!")).toBeTruthy();
    });

    it("renders the custom text", () => {
        const { getByText } = render(<App />);
        expect(
            getByText("YEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE COMMUUUTTEEE AAIIII")
        ).toBeTruthy();
    });
});
