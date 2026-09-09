import express, { type Request, type Response } from 'express';
import { sessionAuthentication } from '../function/middleware.ts';
import List from '../model/list.ts';

const router = express.Router();

router.post("", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required", status: "failed" });
        }

        const createdList = await List.create({ title, description, userId: req.user?.id });

        return res.status(201).json({ message: "List created successfully", status: "success", data: createdList });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error", status: "failed" })
    }
})

router.get("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const foundList = await List.findAll({ where: { userId: req.user?.id }, order: [['updatedAt', 'DESC']] });

        return res.status(200).json({ message: "List retrieved successfully", data: foundList, status: "success" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error", status: "failed" })
    }
})

router.get("/:id", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const foundList = await List.findOne({ where: { id, userId: req.user?.id } });
        if (!foundList) {
            return res.status(404).json({ message: "List not found", status: "failed" });
        }

        return res.status(200).json({ message: "List retrieved successfully", data: foundList, status: "success" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error", status: "failed" })
    }
})

router.put("/:id", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description is required", status: "failed" });
        }
        const foundList = await List.findOne({ where: { id, userId: req.user?.id } });
        if (!foundList) {
            return res.status(404).json({ message: "List not found", status: "failed" });
        }
        foundList.title = title
        foundList.description = description
        let updatedList = await foundList.save();
        return res.status(200).json({ message: "List updated successfully", status: "success", data: updatedList });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error", status: "failed" })
    }
})

router.delete("/:id", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const foundList = await List.findOne({ where: { id, userId: req.user?.id } });
        if (!foundList) {
            return res.status(404).json({ message: "List not found", status: "failed" });
        }
        await foundList.destroy();
        return res.status(200).json({ message: "List deleted successfully", status: "success" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error", status: "failed" })
    }
})

export default router