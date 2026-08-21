import express, { type Request, type Response } from 'express';
import bcrypt from "bcrypt";
import { Op } from 'sequelize';
import User from '../model/user.ts';
import { sessionAuthentication } from '../function/middleware.ts';

const router = express.Router();

router.get("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const foundUser = await User.findByPk(Number(req.user?.id));
        if (!foundUser) {
            return res.status(404).json({ message: "User not found", status: "failed" });
        }

        let data = {
            id: foundUser.id,
            username: foundUser.username,
        }
        return res.status(200).json({ message: "User retrieved successfully", data, status: "success" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error", status: "failed" })
    }
})

router.put("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        let foundUser = await User.findByPk(Number(req.user?.id));
        if (!foundUser) {
            return res.status(404).json({ message: "User not found", status: "failed" });
        }

        if (username) {
            let foundUsername = await User.findOne({ where: { username, id: { [Op.not]: foundUser.id } } });
            if (foundUsername) {
                return res.status(400).json({ message: "Username already exists", status: "failed" });
            }
            foundUser.username = username;
        }

        if (password) {
            const hash = bcrypt.hashSync(password, 10);
            foundUser.password = hash;
        }

        await foundUser.save();
        return res.status(200).json({ message: "User updated successfully", status: "success" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error", status: "failed" })
    }
})

export default router