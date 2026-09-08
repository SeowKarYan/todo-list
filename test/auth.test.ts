import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import { connectToDatabase, disconnectDatabase } from "../src/database.ts";

beforeAll(async () => {
    await connectToDatabase()
});

afterAll(async () => {
    await disconnectDatabase()
});

describe("POST /api/auth/login", () => {
    it("login successfully", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username: "karyan",
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
    });

    it("login failed with missing password", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username: "karyan",
            });

        expect(response.status).toBe(400);
    });

    it("login failed with unregister user account", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username: "karyan2",
                password: "123456",
            });

        expect(response.status).toBe(404);
    });

    it("login failed with wrong password", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                username: "karyan",
                password: "1234567",
            });

        expect(response.status).toBe(400);
    });
});