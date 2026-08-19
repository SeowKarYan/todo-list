import express, { type Request, type Response } from 'express';

const router = express.Router();

router.get("/:userId", (req: Request, res: Response) => {
    return res.status(200).json({ message: "This is get user API" })
})

router.post("/:userId", (req: Request, res: Response) => {
    return res.status(200).json({ message: "This is post user API" })
})

export default router