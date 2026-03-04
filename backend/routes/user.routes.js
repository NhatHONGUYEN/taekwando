import express from "express";
import * as userController from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/sync", protectedRoute, userController.syncUser);

router.get("/", protectedRoute, userController.getUser);

router.patch("/", protectedRoute, userController.updateUser);

router.delete("/", protectedRoute, userController.deleteUser);

export default router;
