import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import { connectToDatabase, disconnectDatabase } from "../src/database.ts";

const agent = request.agent(app);

beforeAll(async () => {
    await connectToDatabase()

    await agent
        .post("/api/auth/login")
        .send({
            username: "test-account",
            password: "123456",
        });
});

afterAll(async () => {
    await disconnectDatabase()

    await agent
        .post("/api/auth/logout")

});

describe("GET /api/user", () => {
    it("fetch user successfully", async () => {
        const response = await agent
            .get("/api/user")

        expect(response.status).toBe(200);
    });
});

describe("PUT /api/user", () => {
    it("update user successfully", async () => {
        const response = await agent
            .put("/api/user")
            .send({
                username: "test-account",
                password: "123456",
            });

        expect(response.status).toBe(200);
    });
});
