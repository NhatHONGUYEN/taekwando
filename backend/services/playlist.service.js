import Playlist from "../models/Playlist.js";
import { NotFoundError } from "../errors/index.js";

export const createPlaylist = async (userId, data) => {
  const playlist = await Playlist.create({
    clerkUserId: userId,
    name: data.name,
    description: data.description || "",
    isPublic: data.isPublic || false,
  });

  return playlist;
};

export const getUserPlaylists = async (userId) => {
  return await Playlist.find({ clerkUserId: userId }).sort({ updatedAt: -1 });
};

export const getPlaylistById = async (playlistId, userId) => {
  const playlist = await Playlist.findOne({
    _id: playlistId,
    clerkUserId: userId,
  });
  if (!playlist) throw new NotFoundError("Playlist not found");
  return playlist;
};

export const updatePlaylist = async (playlistId, userId, data) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: playlistId, clerkUserId: userId },
    { $set: data },
    { returnDocument: "after" },
  );
  if (!playlist) throw new NotFoundError("Playlist not found");
  return playlist;
};

export const deletePlaylist = async (playlistId, userId) => {
  const playlist = await Playlist.findOneAndDelete({
    _id: playlistId,
    clerkUserId: userId,
  });
  if (!playlist) throw new NotFoundError("Playlist not found");
  return playlist;
};

export const addExerciseToPlaylist = async ({
  userId,
  playlistId,
  exerciseId,
}) => {
  const playlist = await Playlist.findOne({
    _id: playlistId,
    clerkUserId: userId,
  });
  if (!playlist) throw new NotFoundError("Playlist not found");

  const order = playlist.items.length + 1;
  playlist.items.push({ exerciseId, order });

  return await playlist.save();
};

export const removeExerciseFromPlaylist = async ({
  userId,
  playlistId,
  exerciseId,
}) => {
  const playlist = await Playlist.findOne({
    _id: playlistId,
    clerkUserId: userId,
  });
  if (!playlist) throw new NotFoundError("Playlist not found");

  playlist.items = playlist.items.filter(
    (item) => item.exerciseId.toString() !== exerciseId,
  );

  return await playlist.save();
};
