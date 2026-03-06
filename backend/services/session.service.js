import Session from "../models/Session.js";
import { NotFoundError } from "../errors/index.js";

export const createSession = async (clerkUserId, payload) => {
  const session = await Session.create({
    clerkUserId,
    ...payload,
  });

  return session;
};

export const getUserSessions = async (clerkUserId) => {
  const sessions = await Session.find({ clerkUserId })
    .sort({ performedAt: -1 })
    .populate("items.exerciseId", "name slug");

  return sessions;
};

export const getSessionById = async (sessionId, clerkUserId) => {
  const session = await Session.findOne({
    _id: sessionId,
    clerkUserId,
  }).populate("items.exerciseId", "name slug");

  if (!session) {
    throw new NotFoundError("Session not found");
  }

  return session;
};

export const updateSession = async (sessionId, clerkUserId, payload) => {
  const session = await Session.findOneAndUpdate(
    {
      _id: sessionId,
      clerkUserId,
    },
    payload,
    { new: true },
  ).populate("items.exerciseId", "name slug");

  if (!session) {
    throw new NotFoundError("Session not found");
  }

  return session;
};

export const deleteSession = async (sessionId, clerkUserId) => {
  const session = await Session.findOneAndDelete({
    _id: sessionId,
    clerkUserId,
  });

  if (!session) {
    throw new NotFoundError("Session not found");
  }
};
