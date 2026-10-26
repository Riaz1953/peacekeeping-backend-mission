import mongoose from "mongoose";

const missionUnitSchema = new mongoose.Schema(
  {
    mission: { type: String, required: true, unique: true, uppercase: true },
    units: [{ type: String, uppercase: true }],
  },
  { timestamps: true },
);

export const MissionUnit = mongoose.model("MissionUnit", missionUnitSchema);
