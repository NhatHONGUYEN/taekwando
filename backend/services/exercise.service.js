import Exercise from "../models/Exercise.js";
import { NotFoundError } from "../errors/index.js";

export const getAllExercises = async ({
  category,
  level,
  focus,
  equipment,
  page,
  limit,
}) => {
  const filter = {};

  if (category) filter.category = category;
  if (level != null) filter.level = level;
  if (focus.length) filter.focus = { $in: focus };
  if (equipment.length) filter.equipment = { $in: equipment };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Exercise.find(filter).skip(skip).limit(limit),
    Exercise.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getExerciseBySlug = async (slug) => {
  const exercise = await Exercise.findOne({ slug });

  if (!exercise) {
    throw new NotFoundError("Exercise not found");
  }

  return exercise;
};
