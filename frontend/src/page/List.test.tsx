import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";

import List from "./List";

describe("List", () => {
    it("renders list page", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <List />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
    });
})