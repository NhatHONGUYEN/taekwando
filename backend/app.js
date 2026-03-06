import { clerkMiddleware } from "@clerk/express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
app.use(clerkMiddleware());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/users", userRoutes);
app.use("/playlists", playlistRoutes);
app.use("/exercises", exerciseRoutes);
app.use("/sessions", sessionRoutes);

app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

export default app;
