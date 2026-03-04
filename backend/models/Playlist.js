import mongoose from "mongoose";

const PlaylistItemSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
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
    },

    description: {
      type: String,
      default: "",
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    items: {
      type: [PlaylistItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

PlaylistSchema.index({ clerkUserId: 1, updatedAt: -1 });

export default mongoose.model("Playlist", PlaylistSchema);
