import express from "express";
import * as exerciseController from "../controllers/exercise.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Exercise catalog (public)
 */

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Get all exercises
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [mobility, flexibility, strength]
 *         description: Filter by category
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by level
 *     responses:
 *       200:
 *         description: List of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 */
router.get("/", exerciseController.getAllExercises);

/**
 * @swagger
 * /exercises/{slug}:
 *   get:
 *     summary: Get an exercise by slug
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: front-kick
 *     responses:
 *       200:
 *         description: Exercise found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Exercise not found
 */
router.get("/:slug", exerciseController.getExerciseBySlug);

export default router;
