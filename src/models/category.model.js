import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true, trim: true },
    mission: { type: String, required: true, uppercase: true, trim: true },
    unit: { type: String, required: true, uppercase: true, trim: true },
  },
  { timestamps: true },
);

categorySchema.index({ name: 1, mission: 1, unit: 1 }, { unique: true });

export const Category = mongoose.model("Category", categorySchema);
