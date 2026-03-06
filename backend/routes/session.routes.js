import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import * as sessionController from "../controllers/session.controller.js";

const router = express.Router();

router.post("/", protectedRoute, sessionController.createSession);
router.get("/", protectedRoute, sessionController.getUserSessions);
router.get("/:id", protectedRoute, sessionController.getSessionById);
router.patch("/:id", protectedRoute, sessionController.updateSession);
router.delete("/:id", protectedRoute, sessionController.deleteSession);

export default router;
