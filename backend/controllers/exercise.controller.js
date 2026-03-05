import * as exerciseService from "../services/exercise.service.js";

export const getAllExercises = async (req, res, next) => {
  try {
    const exercises = await exerciseService.getAllExercises();
    res.status(200).json(exercises);
  } catch (error) {
    next(error);
  }
};

export const getExerciseBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const exercise = await exerciseService.getExerciseBySlug(slug);

    res.status(200).json(exercise);
  } catch (error) {
    next(error);
  }
};
