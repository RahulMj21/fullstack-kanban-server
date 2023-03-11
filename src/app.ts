import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { authRoutes, boardRoutes, testRoutes } from "./routes";
import { checkAuth, errorHandler } from "./middlewares";

const app = express();

app.use(express.json());
app.use(
    cors({ origin: "*", methods: ["GET", "PUT", "POST", "PATCH", "DELETE"] })
);

app.use("/api/v1", testRoutes);
app.use("/api/v1/users", authRoutes);
app.use(checkAuth);
app.use("/api/v1/boards", boardRoutes);

app.use(errorHandler);
export default app;
