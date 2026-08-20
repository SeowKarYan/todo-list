import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import cookieParser from "cookie-parser";

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/list", listRoutes);

// serve static files
// app.use('/', express.static(path.join(__dirname, "public", "build")));
// app.get("*", (req, res) => {
// 	res.sendFile(path.resolve(__dirname, "public", "build", "index.html"));
// });

// Error handling middleware 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;