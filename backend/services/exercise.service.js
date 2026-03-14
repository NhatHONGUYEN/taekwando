import Exercise from "../models/Exercise.js";
import { NotFoundError } from "../errors/index.js";

export const getAllExercises = async ({
  category,
  level,
  focus,
  equipment,
  tags,
  isFeatured,
  page,
  limit,
}) => {
  const filter = { isPublished: true };

  if (category) filter.category = category;
  if (level != null) filter.level = level;
  if (focus.length) filter.focus = { $in: focus };
  if (equipment.length) filter.equipment = { $in: equipment };
  if (tags.length) filter.tags = { $in: tags };
  if (isFeatured !== null) filter.isFeatured = isFeatured;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Exercise.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
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
