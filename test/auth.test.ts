import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import { connectToDatabase, disconnectDatabase } from "../src/database.ts";
import User from "../src/model/user.ts";

beforeAll(async () => {
    await connectToDatabase()
});

afterAll(async () => {
    await disconnectDatabase()
});

describe("POST /api/auth/register", () => {
    afterEach(async () => {
        // Clean up the database after each test
        let foundUser = await User.findOne({ where: { username: "test-register" } });
        if (foundUser) {
            await User.destroy({ where: { username: "test-register" } });
        }
    })

    it("register without username", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                password: "123456",
            });

        expect(response.status).toBe(400);
    });

    it("register without password", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "test-register",
            });

        expect(response.status).toBe(400);
    });

    it("register same username with existing account", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "test-account",
                password: "123456",
            });

        expect(response.status).toBe(400);
    });

    it("register successfully", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "test-register",
                password: "123456",
            });

        expect(response.status).toBe(201);
    });
});

describe("POST /api/auth/login", () => {
    it("login successfully", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username: "test-account",
                password: "123456",
            });

        expect(response.status).toBe(200);

        expect(response.headers["set-cookie"]).toBeDefined();
    });

    it("login failed with missing username", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                password: "123456",
            });

        expect(response.status).toBe(400);

        expect(response.headers["set-cookie"]).not.toBeDefined();
    });

    it("login failed with missing password", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username: "test-account",
            });

        expect(response.status).toBe(400);

        expect(response.headers["set-cookie"]).not.toBeDefined();
    });

    it("login failed with unregister user account", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username: "unregistered",
                password: "123456",
            });

        expect(response.status).toBe(404);

        expect(response.headers["set-cookie"]).not.toBeDefined();
    });

    it("login failed with wrong password", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username: "test-account",
                password: "1234567",
            });

        expect(response.status).toBe(400);

        expect(response.headers["set-cookie"]).not.toBeDefined();
    });
});

describe("POST /api/auth/logout", () => {
    it("logout successfully", async () => {
        const response = await request(app)
            .post("/api/auth/logout")

        expect(response.status).toBe(200);

        expect(response.headers["set-cookie"]).toBeDefined();
    });
});