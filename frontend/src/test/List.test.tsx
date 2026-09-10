import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "./renderWithProviders";
import List from "../page/List";
import type { getListResponse } from "../types/list";

// Mock navigate
const navigate = vi.fn();

vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>("react-router");

    return {
        ...actual,
        useNavigate: () => navigate,
    };
});

// Mock the API hook
const getFullList = vi.fn<
    () => {
        data: getListResponse[];
        isLoading: boolean;
        isError: boolean;
        error: unknown;
    }
>();
const addList = vi.fn();
const updateList = vi.fn();
const deleteList = vi.fn();
const logout = vi.fn();

vi.mock("../redux/services/listApi", () => ({
    useGetFullListQuery: () => getFullList(),
    useAddListMutation: () => [addList, { isLoading: false }],
    useUpdateListMutation: () => [updateList, { isLoading: false }],
    useDeleteListMutation: () => [deleteList, { isLoading: false }],
}));

vi.mock("../redux/services/authApi", () => ({
    useLogoutMutation: () => [logout, { isLoading: false }],
}));

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    cleanup();
});

describe("Get Full List", () => {
    it("renders list page with loading state", () => {
        getFullList.mockReturnValue({
            data: [],
            isLoading: true,
            isError: false,
            error: undefined,
        });

        renderWithProviders(<List />)

        expect(screen.getByTestId("list-loading-spinner")).toBeInTheDocument();
        expect(screen.queryByTestId("list-items")).not.toBeInTheDocument();
        expect(screen.queryByTestId("empty-list")).not.toBeInTheDocument();
    });

    it("renders list page with empty data", () => {
        getFullList.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
            error: undefined,
        });

        renderWithProviders(<List />)

        expect(screen.queryByTestId("list-loading-spinner")).not.toBeInTheDocument();
        expect(screen.queryByTestId("list-items")).not.toBeInTheDocument();
        expect(screen.getByTestId("empty-list")).toBeInTheDocument();
    });

    it("renders list page with data", () => {
        getFullList.mockReturnValue({
            data: [
                {
                    id: 1,
                    title: "Test List Title",
                    description: "This is a test list description.",
                    userId: 1,
                    createdAt: "2026-01-01T00:00:00.000Z",
                    updatedAt: "2026-01-01T00:00:00.000Z",
                },
            ],
            isLoading: false,
            isError: false,
            error: undefined,
        });

        renderWithProviders(<List />)

        expect(screen.queryByTestId("list-loading-spinner")).not.toBeInTheDocument();
        expect(screen.getByTestId("list-items")).toBeInTheDocument();
        expect(screen.queryByTestId("empty-list")).not.toBeInTheDocument();
    });

    it("display error from backend when failed to fetch list", () => {
        getFullList.mockReturnValue({
            data: [],
            isLoading: false,
            isError: true,
            error: {
                data: {
                    message: "Internal Error",
                    status: "failed"
                }
            },
        });

        renderWithProviders(<List />)

        expect(screen.queryByTestId("list-loading-spinner")).not.toBeInTheDocument();
        expect(screen.queryByTestId("list-items")).not.toBeInTheDocument();
        expect(screen.queryByTestId("empty-list")).not.toBeInTheDocument();
        expect(screen.getByText("Internal Error")).toBeInTheDocument();
        expect(navigate).not.toHaveBeenCalled();
    });

    it("display error when failed to fetch list", () => {
        getFullList.mockReturnValue({
            data: [],
            isLoading: false,
            isError: true,
            error: "Network Error",
        });

        renderWithProviders(<List />)

        expect(screen.queryByTestId("list-loading-spinner")).not.toBeInTheDocument();
        expect(screen.queryByTestId("list-items")).not.toBeInTheDocument();
        expect(screen.queryByTestId("empty-list")).not.toBeInTheDocument();
        expect(screen.getByText("Network Error")).toBeInTheDocument();
        expect(navigate).not.toHaveBeenCalled();
    });

    it("display fallback error when failed to fetch list", () => {
        getFullList.mockReturnValue({
            data: [],
            isLoading: false,
            isError: true,
            error: null,
        });

        renderWithProviders(<List />)

        expect(screen.queryByTestId("list-loading-spinner")).not.toBeInTheDocument();
        expect(screen.queryByTestId("list-items")).not.toBeInTheDocument();
        expect(screen.queryByTestId("empty-list")).not.toBeInTheDocument();
        expect(screen.getByText("Failed to load lists.")).toBeInTheDocument();
        expect(navigate).not.toHaveBeenCalled();
    });

    it("unauthorized and navigate to /", () => {
        getFullList.mockReturnValue({
            data: [],
            isLoading: false,
            isError: true,
            error: {
                data: {
                    message: "Unauthorized",
                    status: "failed"
                }
            },
        });

        renderWithProviders(<List />)

        expect(navigate).toHaveBeenCalledWith("/");
    });
})

describe("Add List", () => {
    it("add list successfully", async () => {
        addList.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                data: {
                    message: "List created successfully",
                    status: "success"
                }
            }),
        });

        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Add list" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Add list" }));

        await user.type(screen.getByPlaceholderText("Title"), "New List Title");

        await user.type(screen.getByPlaceholderText("Description"), "New List Description");

        await user.click(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() => {
            expect(addList).toHaveBeenCalledWith({
                title: "New List Title",
                description: "New List Description",
            });
        });

        expect(await screen.findByText("List created successfully")).toBeInTheDocument();
    });

    it("add list failed", async () => {
        addList.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                data: {
                    message: "Failed to add list.",
                    status: "failed"
                },
            }),
        });

        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Add list" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Add list" }));

        await user.type(screen.getByPlaceholderText("Title"), "New List Title");

        await user.type(screen.getByPlaceholderText("Description"), "New List Description");

        await user.click(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() => {
            expect(addList).toHaveBeenCalledWith({
                title: "New List Title",
                description: "New List Description",
            });
        });

        expect(await screen.findByText("Failed to add list.")).toBeInTheDocument();
    });

    it("missing title when add list", async () => {
        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Add list" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Add list" }));

        await user.type(screen.getByPlaceholderText("Description"), "New List Description");

        await user.click(screen.getByRole("button", { name: "Submit" }));

        expect(addList).not.toHaveBeenCalled()

        expect(await screen.findByText("Please enter a title")).toBeInTheDocument();
    });

    it("missing description when add list", async () => {
        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Add list" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Add list" }));

        await user.type(screen.getByPlaceholderText("Title"), "New List Title");

        await user.click(screen.getByRole("button", { name: "Submit" }));

        expect(addList).not.toHaveBeenCalled()

        expect(await screen.findByText("Please enter a description")).toBeInTheDocument();
    });
})

describe("Edit List", () => {
    beforeEach(() => {
        getFullList.mockReturnValue({
            data: [
                {
                    id: 1,
                    title: "Test List Title",
                    description: "This is a test list description.",
                    userId: 1,
                    createdAt: "2026-01-01T00:00:00.000Z",
                    updatedAt: "2026-01-01T00:00:00.000Z",
                },
            ],
            isLoading: false,
            isError: false,
            error: undefined,
        });
    });

    it("edit list successfully", async () => {
        updateList.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                data: {
                    message: "List updated successfully",
                    status: "success"
                }
            }),
        });

        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Edit" }));

        await user.clear(screen.getByPlaceholderText("Title"));
        await user.type(screen.getByPlaceholderText("Title"), "New List Title");

        await user.clear(screen.getByPlaceholderText("Description"));
        await user.type(screen.getByPlaceholderText("Description"), "New List Description");

        await user.click(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() => {
            expect(updateList).toHaveBeenCalledWith({
                id: 1,
                title: "New List Title",
                description: "New List Description",
            });
        });

        expect(await screen.findByText("List updated successfully")).toBeInTheDocument();
    });

    it("edit list failed", async () => {
        updateList.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                data: {
                    message: "Failed to update list.",
                    status: "failed"
                },
            }),
        });

        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Edit" }));

        await user.clear(screen.getByPlaceholderText("Title"));
        await user.type(screen.getByPlaceholderText("Title"), "New List Title");

        await user.clear(screen.getByPlaceholderText("Description"));
        await user.type(screen.getByPlaceholderText("Description"), "New List Description");

        await user.click(screen.getByRole("button", { name: "Submit" }));

        await waitFor(() => {
            expect(updateList).toHaveBeenCalledWith({
                id: 1,
                title: "New List Title",
                description: "New List Description",
            });
        });

        expect(await screen.findByText("Failed to update list.")).toBeInTheDocument();
    });
})

describe("Delete List", () => {
    beforeEach(() => {
        getFullList.mockReturnValue({
            data: [
                {
                    id: 1,
                    title: "Test List Title",
                    description: "This is a test list description.",
                    userId: 1,
                    createdAt: "2026-01-01T00:00:00.000Z",
                    updatedAt: "2026-01-01T00:00:00.000Z",
                },
            ],
            isLoading: false,
            isError: false,
            error: undefined,
        });
    });


    it("delete list successfully", async () => {
        deleteList.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                data: {
                    message: "List deleted successfully",
                    status: "success"
                }
            }),
        });

        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Delete" }));

        await user.click(screen.getByRole("button", { name: "Confirm" }));

        await waitFor(() => {
            expect(deleteList).toHaveBeenCalledWith(1);
        });

        expect(await screen.findByText("List deleted successfully")).toBeInTheDocument();
    });

    it("delete list failed", async () => {
        deleteList.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                data: {
                    message: "Failed to delete list.",
                    status: "failed"
                },
            }),
        });

        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Delete" }));

        await user.click(screen.getByRole("button", { name: "Confirm" }));

        await waitFor(() => {
            expect(deleteList).toHaveBeenCalledWith(1);
        });

        expect(await screen.findByText("Failed to delete list.")).toBeInTheDocument();
    });
})

describe("Logout", () => {
    it("logout successfully and navigate to /", async () => {
        logout.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                data: {
                    message: "Logged out",
                    status: "success"
                }
            }),
        });

        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Logout" }));

        await waitFor(() => {
            expect(logout).toHaveBeenCalled();
        });

        expect(navigate).toHaveBeenCalledWith("/");
    });

    it("logout failed", async () => {
        logout.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                data: {
                    message: "Failed to log out.",
                    status: "failed"
                }
            }),
        });

        renderWithProviders(<List />)

        expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();

        const user = userEvent.setup();

        await user.click(screen.getByRole("button", { name: "Logout" }));

        await waitFor(() => {
            expect(logout).toHaveBeenCalled();
        });

        expect(await screen.findByText("Failed to log out.")).toBeInTheDocument();

        expect(navigate).not.toHaveBeenCalled();
    });
})