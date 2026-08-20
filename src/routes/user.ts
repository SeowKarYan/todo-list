import express, { type Request, type Response } from 'express';
import bcrypt from "bcrypt";
import { Op } from 'sequelize';
import User from '../model/user.ts';

const router = express.Router();

router.post("", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required", status: "failed" });
        }

        const foundUser = await User.findOne({ where: { username } });
        if (foundUser) {
            return res.status(400).json({ message: "User already exists", status: "failed" });
        }

        const hash = bcrypt.hashSync(password, 10);
        await User.create({ username, password: hash });
        return res.status(201).json({ message: "User created successfully", status: "success" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error", status: "failed" })
    }
})

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID is required", status: "failed" });
        }

        let foundUser = await User.findByPk(Number(id));
        if (!foundUser) {
            return res.status(404).json({ message: "User not found", status: "failed" });
        }

        if (username) {
            let foundUsername = await User.findOne({ where: { username, id: { [Op.not]: id } } });
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