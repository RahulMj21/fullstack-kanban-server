import dotenv from "dotenv";
dotenv.config();
import config from "config";
import app from "./app";
import connectDb from "./db";

const PORT = config.get<string>("port");

app.listen(PORT, async () => {
    await connectDb();
    console.log(`server is running on PORT: ${PORT}...`);
});
