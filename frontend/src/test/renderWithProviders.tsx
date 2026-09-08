import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { store } from "../redux/store";
import type { ReactElement } from "react";

export function renderWithProviders(
    ui: ReactElement,
    { route = "/" }: { route?: string } = {},
) {
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[route]}>
                {ui}
            </MemoryRouter>
        </Provider>,
    );
}