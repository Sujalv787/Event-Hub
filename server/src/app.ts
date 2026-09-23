import express, { Application } from "express";
import cors from "cors";
import { env } from "./config/env";
import routes from "./routes";
import { notFound, errorHandler } from "./middleware/error.middleware";

const app: Application = express();

app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "EventHub API is running" });
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
