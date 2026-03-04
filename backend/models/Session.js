import mongoose from "mongoose";

const SessionItemSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },

    completed: {
      type: Boolean,
      default: true,
    },

    repsDone: {
      type: Number,
      min: 0,
    },

    workSecDone: {
      type: Number,
      min: 0,
    },

    rpe: {
      type: Number,
      min: 1,
      max: 10,
    },

    pain: {
      hip: { type: Number, min: 0, max: 10 },
      knee: { type: Number, min: 0, max: 10 },
      lowerBack: { type: Number, min: 0, max: 10 },
    },
  },
  { _id: false },
);

const SessionSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      index: true,
    },

    performedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    durationSec: {
      type: Number,
      required: true,
      min: 0,
    },

    items: {
      type: [SessionItemSchema],
      default: [],
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

SessionSchema.index({ clerkUserId: 1, performedAt: -1 });

export default mongoose.model("Session", SessionSchema);
