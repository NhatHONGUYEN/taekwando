import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import * as sessionController from "../controllers/session.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Training sessions management
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Create a training session
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [durationSec]
 *             properties:
 *               performedAt:
 *                 type: string
 *                 format: date-time
 *               durationSec:
 *                 type: integer
 *                 minimum: 0
 *                 example: 1800
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/SessionItem'
 *               notes:
 *                 type: string
 *                 example: Great session
 *     responses:
 *       201:
 *         description: Session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       401:
 *         description: Unauthorized
 */
router.post("/", protectedRoute, sessionController.createSession);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Get all sessions of the authenticated user
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *       401:
 *         description: Unauthorized
 */
router.get("/", protectedRoute, sessionController.getUserSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 64abc123def456
 *     responses:
 *       200:
 *         description: Session found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.get("/:id", protectedRoute, sessionController.getSessionById);

/**
 * @swagger
 * /sessions/{id}:
 *   patch:
 *     summary: Update a session
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               durationSec:
 *                 type: integer
 *                 minimum: 0
 *               notes:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/SessionItem'
 *     responses:
 *       200:
 *         description: Session updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.patch("/:id", protectedRoute, sessionController.updateSession);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Delete a session
 *     tags: [Sessions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.delete("/:id", protectedRoute, sessionController.deleteSession);

export default router;
