import express, { type Request, type Response } from 'express';
import { authenticate } from '../function/middleware.ts';

const router = express.Router();

router.post("", authenticate, async (req: Request, res: Response) => {
    return res.status(200).json({ message: "This is get user API" })
})

router.get("/:id", authenticate, async (req: Request, res: Response) => {
    return res.status(200).json({ message: "This is post user API" })
})

router.put("/:id", authenticate, async (req: Request, res: Response) => {
    return res.status(200).json({ message: "This is post user API" })
})

router.delete("/:id", authenticate, async (req: Request, res: Response) => {
    return res.status(200).json({ message: "This is delete user API" })
})

export default router