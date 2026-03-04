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

router.post("/", createPlaylist);
router.get("/", getUserPlaylists);
router.get("/:id", validateObjectId("id"), getPlaylistById);
router.patch("/:id", validateObjectId("id"), updatePlaylist);
router.delete("/:id", validateObjectId("id"), deletePlaylist);
router.post("/:id/exercises", validateObjectId("id"), addExerciseToPlaylist);
router.delete(
  "/:id/exercises/:exerciseId",
  validateObjectId("id"),
  validateObjectId("exerciseId"),
  removeExerciseFromPlaylist,
);

export default router;
