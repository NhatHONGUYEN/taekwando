import { getAuth } from "@clerk/express";
import * as userService from "../services/user.service.js";
import { UnauthorizedError } from "../errors/index.js";

export const syncUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const user = await userService.syncUser({
      clerkUserId: userId,
      displayName: req.body.displayName,
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const user = await userService.getUserByClerkId(userId);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const user = await userService.updateUser(userId, req.body);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    await userService.deleteUser(userId);

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};
