import mongoose from "mongoose";
import { getAuth } from "@clerk/express";
import * as sessionService from "../services/session.service.js";
import { BadRequestError } from "../errors/index.js";

export const createSession = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    const session = await sessionService.createSession(userId, req.body);

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const getUserSessions = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    const sessions = await sessionService.getUserSessions(userId);

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new BadRequestError("sessionId invalid");
    }

    const { userId } = getAuth(req);

    const session = await sessionService.getSessionById(req.params.id, userId);

    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    const session = await sessionService.updateSession(
      req.params.id,
      userId,
      req.body,
    );

    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    await sessionService.deleteSession(req.params.id, userId);

    res.json({ message: "Session deleted" });
  } catch (error) {
    next(error);
  }
};
