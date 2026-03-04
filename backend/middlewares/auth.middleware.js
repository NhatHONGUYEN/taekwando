import { getAuth } from "@clerk/express";
import { UnauthorizedError } from "../errors/index.js";

export const protectedRoute = (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(new UnauthorizedError("Unauthorized"));
  }

  next();
};
