import mongoose from "mongoose";

const CloudinaryVideoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    durationSec: { type: Number, min: 0 },
    format: { type: String },
    bytes: { type: Number, min: 0 },
    thumbnailUrl: { type: String },
  },
  { _id: false },
);

const ExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },

    category: {
      type: String,
      required: true,
      enum: ["mobility", "flexibility", "strength"],
      index: true,
    },

    level: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
      index: true,
    },

    focus: {
      type: [String],
      default: [],
      index: true,
    },

    equipment: {
      type: [String],
      default: ["none"],
    },

    durationSecDefault: {
      type: Number,
      min: 10,
      default: 45,
    },

    instructions: {
      type: [String],
      default: [],
    },

    commonMistakes: {
      type: [String],
      default: [],
    },

    safetyNotes: {
      type: [String],
      default: [],
    },

    video: CloudinaryVideoSchema,

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

ExerciseSchema.index({ category: 1, level: 1, isPublished: 1 });
ExerciseSchema.index({ focus: 1, category: 1 });

export default mongoose.model("Exercise", ExerciseSchema);
