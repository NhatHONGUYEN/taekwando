import mongoose from "mongoose";
import { BadRequestError } from "../errors/index.js";

export default function validateObjectId(paramName) {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(value)) {
      return next(new BadRequestError(`${paramName} is invalid`));
    }

    next();
  };
}
