import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from "./renderWithProviders";
import Login from "../page/Login";

// Mock the API hook
const login = vi.fn();

vi.mock("../redux/services/authApi", () => ({
    useLoginMutation: () => [login, { isLoading: false, }],
}));

// Mock navigate
const navigate = vi.fn();

vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>("react-router");

    return {
        ...actual,
        useNavigate: () => navigate,
    };
});

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    cleanup();
});


describe("Render Login", () => {
    it("renders login form", () => {
        renderWithProviders(<Login />)

        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });
});

describe("Submit Login Form", () => {
    it("logs in successfully and navigates to /list", async () => {
        login.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                data: {
                    message: "Login successfully",
                    status: "success"
                }
            }),
        });

        renderWithProviders(<Login />)

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Username"), "test-account");

        await user.type(screen.getByPlaceholderText("Password"), "123456");

        await user.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                username: "test-account",
                password: "123456",
            });
        });

        expect(navigate).toHaveBeenCalledWith("/list");
    });

    it("shows error message from backend when login failed", async () => {
        login.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                data: {
                    message: "Password is incorrect",
                    status: "failed"
                },
            }),
        });

        renderWithProviders(<Login />)

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Username"), "test-account");

        await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");

        await user.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                username: "test-account",
                password: "wrongpassword",
            });
        });

        expect(await screen.findByText("Password is incorrect")).toBeInTheDocument();

        expect(navigate).not.toHaveBeenCalled();
    });

    it("shows error message when call to backend failed", async () => {
        login.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue("Network error"),
        });

        renderWithProviders(<Login />)

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Username"), "test-account");

        await user.type(screen.getByPlaceholderText("Password"), "123456");

        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Network error")).toBeInTheDocument();

        expect(navigate).not.toHaveBeenCalled();
    });

    it("missing username submit login form", async () => {
        renderWithProviders(<Login />)

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Password"), "123456");

        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Please enter your username")).toBeInTheDocument();

        expect(login).not.toHaveBeenCalled()

        expect(navigate).not.toHaveBeenCalled();
    });

    it("missing password submit login form", async () => {
        renderWithProviders(<Login />)

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Username"), "test-account");

        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Please enter your password")).toBeInTheDocument();

        expect(login).not.toHaveBeenCalled()

        expect(navigate).not.toHaveBeenCalled();
    });
});