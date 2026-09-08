import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from "react-router";
import Login from "./Login";

// Mock the API hook
const mockLogin = vi.fn();

vi.mock("../redux/services/authApi", () => ({
    useLoginMutation: () => [
        mockLogin,
        {
            isLoading: false,
        },
    ],
}));

// Mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>("react-router");

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Login", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    });

    afterEach(() => {
        cleanup();
    });

    it("renders login form", () => {
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    });

    it("logs in successfully and navigates to /list", async () => {
        mockLogin.mockReturnValue({
            unwrap: vi.fn().mockResolvedValue({
                message: "Login successfully",
                status: "success"
            }),
        });

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Username"), "karyan");

        await user.type(screen.getByPlaceholderText("Password"), "123456");

        await user.click(screen.getByRole("button", { name: "Login" }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                username: "karyan",
                password: "123456",
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith("/list");
    });

    it("shows error message from backend when login failed", async () => {
        mockLogin.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue({
                data: {
                    message: "Password is incorrect",
                    status: "failed"
                },
            }),
        });

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Username"), "karyan");

        await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");

        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Password is incorrect")).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("shows error message when call to backend failed", async () => {
        mockLogin.mockReturnValue({
            unwrap: vi.fn().mockRejectedValue("Network error"),
        });

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText("Username"), "karyan");

        await user.type(screen.getByPlaceholderText("Password"), "123456");

        await user.click(screen.getByRole("button", { name: "Login" }));

        expect(await screen.findByText("Network error")).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});