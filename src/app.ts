import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { authRoutes, testRoutes } from "./routes";
import { errorHandler } from "./middlewares";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/v1", testRoutes);
app.use("/api/v1", authRoutes);

app.use(errorHandler);
export default app;
