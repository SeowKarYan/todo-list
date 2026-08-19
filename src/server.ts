import 'dotenv/config'
import app from "./app.ts";
import { connectToDatabase, syncDatabase } from "./database.ts";

// Connect to the database
await connectToDatabase();

// Sync the database
await syncDatabase()

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});