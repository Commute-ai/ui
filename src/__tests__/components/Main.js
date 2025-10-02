import App from "../../../App";

import { render } from "@testing-library/react-native";

jest.mock('../../api/client');

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
