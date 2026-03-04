import User from "../models/User.js";
import { NotFoundError } from "../errors/index.js";

export const syncUser = async ({ clerkUserId, displayName }) => {
  const existingUser = await User.findOne({ clerkUserId });

  if (existingUser) return existingUser;

  const user = new User({
    clerkUserId,
    displayName,
  });

  return await user.save();
};

export const getUserByClerkId = async (clerkUserId) => {
  const user = await User.findOne({ clerkUserId });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const updateUser = async (clerkUserId, data) => {
  const user = await User.findOneAndUpdate({ clerkUserId }, data, {
    new: true,
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const deleteUser = async (clerkUserId) => {
  const user = await User.findOneAndDelete({ clerkUserId });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};
