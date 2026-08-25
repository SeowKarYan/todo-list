import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.ts"
import userRoutes from "./routes/user.ts"
import listRoutes from "./routes/list.ts"

const app: Express = express();

// parse requests with a Content-Type of application/json
app.use(express.json());
// parse requests with a Content-Type of application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// parse cookies
app.use(cookieParser())
// cors
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/list", listRoutes);

// serve static files
app.use('/', express.static(path.join(import.meta.dirname, "..", "frontend", "dist")));
app.get("/{*app}", (req, res) => {
    res.sendFile(path.join(import.meta.dirname, "..", "frontend", "dist", "index.html"));
});

// Error handling middleware 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;