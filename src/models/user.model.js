import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    likedMedia: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
