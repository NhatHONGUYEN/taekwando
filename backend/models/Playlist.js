import mongoose from "mongoose";

const PlaylistItemSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
      index: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const PlaylistSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },

    items: {
      type: [PlaylistItemSchema],
      default: [],
      validate: {
        validator: (items) => items.length <= 100,
        message: "Playlist cannot exceed 100 exercises",
      },
    },
  },
  { timestamps: true },
);

PlaylistSchema.index({ clerkUserId: 1, updatedAt: -1 });

export default mongoose.model("Playlist", PlaylistSchema);
