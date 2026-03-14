import * as exerciseService from "../services/exercise.service.js";

export const getAllExercises = async (req, res, next) => {
  try {
    const { category, level, focus, equipment, tags, isFeatured } = req.query;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));

    const result = await exerciseService.getAllExercises({
      category,
      level: level !== undefined ? parseInt(level) : null,
      focus: focus ? [].concat(focus) : [],
      equipment: equipment ? [].concat(equipment) : [],
      tags: tags ? [].concat(tags) : [],
      isFeatured: isFeatured !== undefined ? isFeatured === "true" : null,
      page,
      limit,
    });

    res.status(200).json(result);
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
