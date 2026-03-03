const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      default: "",
    },
    level: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    goals: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
