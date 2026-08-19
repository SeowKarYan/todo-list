import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import userRoutes from "./routes/user.ts"

const app: Express = express();

// parse requests with a Content-Type of application/json
app.use(express.json());
// parse requests with a Content-Type of application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoutes);

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