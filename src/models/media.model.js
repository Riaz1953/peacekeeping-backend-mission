import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    keyPerson: {
      type: String,
      default: "",
    },
    mediaType: {
      type: String,
      required: true,
      enum: ["image", "video"],
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    mission: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    programName: {
      type: String,
      default: "General Programme",
    },
    date: {
      type: Date,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

export const Media = mongoose.model("Media", mediaSchema);
