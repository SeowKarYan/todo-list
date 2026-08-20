import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const sessionAuthentication = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.session;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized", status: "failed" });
    }

    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret is not defined", status: "failed" });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: Number((payload as jwt.JwtPayload).id)
        };

        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired session" });
    }
};