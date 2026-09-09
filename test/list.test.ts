import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import { connectToDatabase, disconnectDatabase } from "../src/database.ts";
import List from "../src/model/list.ts";

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

describe("POST /api/list", () => {
    afterEach(async () => {
        // Clean up the database after each test
        let foundList = await List.findOne({ where: { title: "test-title", description: "test-description" } });
        if (foundList) {
            await foundList.destroy()
        }
    })

    it("create list without title", async () => {
        const response = await agent
            .post("/api/list")
            .send({
                description: "test-description",
            });

        expect(response.status).toBe(400);
    });

    it("create list without description", async () => {
        const response = await agent
            .post("/api/list")
            .send({
                title: "test-title",
            });

        expect(response.status).toBe(400);
    });

    it("create list successfully", async () => {
        const response = await agent
            .post("/api/list")
            .send({
                title: "test-title",
                description: "test-description",
            });

        expect(response.status).toBe(201);

        expect(response.body.data).toMatchObject({
            title: "test-title",
            description: "test-description",
        });
    });
});

describe("GET /api/list/", () => {
    it("fetch list successfully", async () => {
        const response = await agent
            .get("/api/list")

        expect(response.status).toBe(200);
    });
});

describe("GET /api/list/:id", () => {
    let fetchListId: number;

    beforeEach(async () => {
        // create list for test
        const createResponse = await agent
            .post("/api/list")
            .send({
                title: "test-fetch-title",
                description: "test-fetch-description",
            });

        fetchListId = createResponse.body.data.id;
    })

    afterEach(async () => {
        // Clean up the database after each test
        let foundList = await List.findByPk(fetchListId);
        if (foundList) {
            await foundList.destroy()
        }
    })

    it("fetch list with incorrect id", async () => {
        const response = await agent
            .get("/api/list/-1")

        expect(response.status).toBe(404);
    });

    it("fetch list successfully", async () => {
        const response = await agent
            .get(`/api/list/${fetchListId}`)

        expect(response.status).toBe(200);

        expect(response.body.data).toMatchObject({
            id: fetchListId,
            title: "test-fetch-title",
            description: "test-fetch-description",
        });
    });
});

describe("PUT /api/list/:id", () => {
    let updatedListId: number;

    beforeEach(async () => {
        // create list for test
        const createResponse = await agent
            .post("/api/list")
            .send({
                title: "title-before-update",
                description: "description-before-update",
            });

        updatedListId = createResponse.body.data.id;
    })

    afterEach(async () => {
        // Clean up the database after each test
        let foundList = await List.findByPk(updatedListId);
        if (foundList) {
            await foundList.destroy()
        }
    })

    it("update list without title", async () => {
        const response = await agent
            .put(`/api/list/${updatedListId}`)
            .send({
                description: "test-update-description",
            });

        expect(response.status).toBe(400);
    });

    it("update list without description", async () => {
        const response = await agent
            .put(`/api/list/${updatedListId}`)
            .send({
                title: "test-update-title",
            });

        expect(response.status).toBe(400);
    });

    it("update list with incorrect id", async () => {
        const response = await agent
            .put("/api/list/-1")
            .send({
                title: "test-update-title",
                description: "test-update-description",
            });

        expect(response.status).toBe(404);
    });

    it("update list successfully", async () => {
        const response = await agent
            .put(`/api/list/${updatedListId}`)
            .send({
                title: "test-update-title",
                description: "test-update-description",
            });

        expect(response.status).toBe(200);

        expect(response.body.data).toMatchObject({
            title: "test-update-title",
            description: "test-update-description",
        });
    });
});

describe("DELETE /api/list/:id", () => {
    it("delete list with incorrect id", async () => {
        const response = await agent
            .delete("/api/list/-1")

        expect(response.status).toBe(404);
    });

    it("delete list successfully", async () => {
        const createResponse = await agent
            .post("/api/list")
            .send({
                title: "test-delete-title",
                description: "test-delete-description",
            });

        const response = await agent
            .delete(`/api/list/${createResponse.body.data.id}`)

        expect(response.status).toBe(200);
    });
});