import express from "express";
import * as exerciseController from "../controllers/exercise.controller.js";

const router = express.Router();

// GET all exercises
router.get("/", exerciseController.getAllExercises);

// GET exercise by slug
router.get("/:slug", exerciseController.getExerciseBySlug);

export default router;
