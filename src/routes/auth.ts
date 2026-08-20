import express, { type Request, type Response } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../model/user.ts';

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required", status: "failed" });
        }

        const foundUser = await User.findOne({ where: { username } });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found", status: "failed" });
        }

        const match = bcrypt.compareSync(password, foundUser.password);
        if (match) {
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: "JWT secret is not defined", status: "failed" });
            }
            let token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
            let data = {
                id: foundUser.id,
                username: foundUser.username,
            }

            res.cookie("session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });
            return res.status(200).json({ message: "Login successfully", data, status: "success" });
        } else {
            return res.status(400).json({ message: "Password is incorrect", status: "failed" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Error", status: "failed" })
    }
})

router.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("session");

    return res.status(200).json({ message: "Logged out", status: "success" });
})

export default router