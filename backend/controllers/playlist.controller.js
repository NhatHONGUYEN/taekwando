import mongoose from "mongoose";
import { BadRequestError } from "../errors/index.js";
import * as playlistService from "../services/playlist.service.js";
import { getAuth } from "@clerk/express";

export const createPlaylist = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const playlist = await playlistService.createPlaylist(userId, req.body);
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const getUserPlaylists = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const playlists = await playlistService.getUserPlaylists(userId);
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const playlist = await playlistService.getPlaylistById(
      req.params.id,
      userId,
    );
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const playlist = await playlistService.updatePlaylist(
      req.params.id,
      userId,
      req.body,
    );
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    await playlistService.deletePlaylist(req.params.id, userId);
    res.json({ message: "Playlist deleted" });
  } catch (error) {
    next(error);
  }
};

export const addExerciseToPlaylist = async (req, res, next) => {
  try {
    const { exerciseId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      throw new BadRequestError("exerciseId is invalid");
    }
    const { userId } = getAuth(req);
    const playlist = await playlistService.addExerciseToPlaylist({
      userId,
      playlistId: req.params.id,
      exerciseId,
    });
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const removeExerciseFromPlaylist = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    const playlist = await playlistService.removeExerciseFromPlaylist({
      userId,
      playlistId: req.params.id,
      exerciseId: req.params.exerciseId,
    });
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};
