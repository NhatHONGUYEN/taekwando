import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addExerciseToPlaylist,
  removeExerciseFromPlaylist,
} from "../controllers/playlist.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

router.use(protectedRoute);

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: User playlists management
 */

/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Create a playlist
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Morning Warm-up
 *               description:
 *                 type: string
 *                 example: Light stretching
 *               isPublic:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Playlist created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       401:
 *         description: Unauthorized
 */
router.post("/", createPlaylist);

/**
 * @swagger
 * /playlists:
 *   get:
 *     summary: Get all playlists of the authenticated user
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of playlists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Playlist'
 *       401:
 *         description: Unauthorized
 */
router.get("/", getUserPlaylists);

/**
 * @swagger
 * /playlists/{id}:
 *   get:
 *     summary: Get a playlist by ID
 *     tags: [Playlists]
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
 *         description: Playlist found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Playlist not found
 */
router.get("/:id", validateObjectId("id"), getPlaylistById);

/**
 * @swagger
 * /playlists/{id}:
 *   patch:
 *     summary: Update a playlist
 *     tags: [Playlists]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Playlist updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Playlist not found
 */
router.patch("/:id", validateObjectId("id"), updatePlaylist);

/**
 * @swagger
 * /playlists/{id}:
 *   delete:
 *     summary: Delete a playlist
 *     tags: [Playlists]
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
 *         description: Playlist deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Playlist not found
 */
router.delete("/:id", validateObjectId("id"), deletePlaylist);

/**
 * @swagger
 * /playlists/{id}/exercises:
 *   post:
 *     summary: Add an exercise to a playlist
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exerciseId]
 *             properties:
 *               exerciseId:
 *                 type: string
 *                 example: 64abc123def456
 *               order:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *     responses:
 *       200:
 *         description: Exercise added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Playlist or exercise not found
 */
router.post("/:id/exercises", validateObjectId("id"), addExerciseToPlaylist);

/**
 * @swagger
 * /playlists/{id}/exercises/{exerciseId}:
 *   delete:
 *     summary: Remove an exercise from a playlist
 *     tags: [Playlists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Playlist'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Playlist not found
 */
router.delete(
  "/:id/exercises/:exerciseId",
  validateObjectId("id"),
  validateObjectId("exerciseId"),
  removeExerciseFromPlaylist,
);

export default router;
