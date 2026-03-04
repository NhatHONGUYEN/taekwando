import { clerkMiddleware } from "@clerk/express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(clerkMiddleware());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use("/users", userRoutes);

app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

export default app;
