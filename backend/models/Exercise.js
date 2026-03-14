import mongoose from "mongoose";

const ExerciseImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    alt: { type: String, default: "" },
  },
  { _id: false },
);

const ExerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 140,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "technique",
        "poomsae",
        "sparring",
        "mobility",
        "strength",
        "flexibility",
      ],
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

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    image: {
      type: ExerciseImageSchema,
      required: true,
    },

    instructions: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 12,
        message: "Instructions cannot exceed 12 steps",
      },
    },

    commonMistakes: {
      type: [String],
      default: [],
    },

    safetyNotes: {
      type: [String],
      default: [],
    },

    durationSecDefault: {
      type: Number,
      min: 10,
      default: 45,
    },

    repsDefault: {
      type: Number,
      min: 1,
    },

    restSecDefault: {
      type: Number,
      min: 0,
      default: 15,
    },

    caloriesEstimate: {
      type: Number,
      min: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

ExerciseSchema.index({ category: 1, level: 1, isPublished: 1 });
ExerciseSchema.index({ focus: 1, category: 1, isPublished: 1 });
ExerciseSchema.index({ tags: 1, isPublished: 1 });
ExerciseSchema.index({ isFeatured: 1, isPublished: 1 });

export default mongoose.model("Exercise", ExerciseSchema);
