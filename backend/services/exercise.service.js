import Exercise from "../models/Exercise.js";
import { NotFoundError } from "../errors/index.js";

export const getAllExercises = async () => {
  return await Exercise.find();
};

export const getExerciseBySlug = async (slug) => {
  const exercise = await Exercise.findOne({ slug });

  if (!exercise) {
    throw new NotFoundError("Exercise not found");
  }

  return exercise;
};
