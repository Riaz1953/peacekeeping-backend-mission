import { Media } from "../models/media.model.js";
import { MissionUnit } from "../models/missionUnit.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Upload media
export const uploadMedia = async (req, res) => {
  try {
    const { title, description, keyPerson, mission, unit, category, date } =
      req.body;
    if (!title || !mission || !unit || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Media file is required" });
    }

    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    if (!cloudinaryResponse?.url) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to upload to cloud" });
    }

    const mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";

    const newMedia = await Media.create({
      title,
      description,
      keyPerson,
      mission: mission.toUpperCase(),
      unit: unit.toUpperCase(),
      category,
      date: date || Date.now(),
      mediaType,
      url: cloudinaryResponse.url,
    });

    res.status(201).json({ success: true, data: newMedia });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all media with filters
export const getAllMedia = async (req, res) => {
  try {
    const { mission, unit, mediaType, search, date } = req.query;
    let query = {};

    if (mission) query.mission = mission.toUpperCase();
    if (unit) query.unit = unit.toUpperCase();
    if (mediaType && mediaType !== "all") query.mediaType = mediaType;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { keyPerson: { $regex: search, $options: "i" } },
      ];
    }

    const mediaList = await Media.find(query).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, count: mediaList.length, data: mediaList });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single media by ID
export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media)
      return res
        .status(404)
        .json({ success: false, message: "Media not found" });
    res.status(200).json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update media
export const updateMedia = async (req, res) => {
  try {
    const { title, description, keyPerson, mission, unit, category, date } =
      req.body;
    let updateData = {
      title,
      description,
      keyPerson,
      mission: mission?.toUpperCase(),
      unit: unit?.toUpperCase(),
      category,
      date,
    };

    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse?.url) {
        updateData.url = cloudinaryResponse.url;
        updateData.mediaType = req.file.mimetype.startsWith("video")
          ? "video"
          : "image";
      }
    }

    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    if (!updatedMedia)
      return res
        .status(404)
        .json({ success: false, message: "Media not found" });

    res.status(200).json({ success: true, data: updatedMedia });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete media
export const deleteMedia = async (req, res) => {
  try {
    const deletedMedia = await Media.findByIdAndDelete(req.params.id);
    if (!deletedMedia)
      return res
        .status(404)
        .json({ success: false, message: "Media not found" });
    res
      .status(200)
      .json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle like
export const toggleLike = async (req, res) => {
  try {
    const { userId } = req.body;
    const media = await Media.findById(req.params.id);
    if (!media)
      return res
        .status(404)
        .json({ success: false, message: "Media not found" });

    const index = media.likedBy.indexOf(userId);
    if (index > -1) {
      media.likedBy.splice(index, 1);
      media.likesCount = Math.max(0, media.likesCount - 1);
    } else {
      media.likedBy.push(userId);
      media.likesCount += 1;
    }

    await media.save();
    res.status(200).json({
      success: true,
      data: {
        isLiked: media.likedBy.includes(userId),
        likesCount: media.likesCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get missions and units from MissionUnit collection
export const getMissionsAndUnits = async (req, res) => {
  try {
    let configData = await MissionUnit.find({});
    if (configData.length === 0) {
      const defaultData = [
        {
          mission: "MONUSCO",
          units: ["BANRDB", "BANENGR", "BANLOG", "BANMED", "BANAMU"],
        },
        { mission: "UNMISS", units: ["BANRDB", "BANENGR", "BANLOG", "BANMED"] },
        { mission: "MINUSCA", units: ["BANRDB", "BANENGR", "BANLOG"] },
      ];
      configData = await MissionUnit.insertMany(defaultData);
    }

    const missionUnitsMap = {};
    configData.forEach((item) => {
      missionUnitsMap[item.mission] = item.units;
    });

    res.status(200).json({ success: true, data: missionUnitsMap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Manage Missions and Units (Add/Delete)
export const manageMissionUnit = async (req, res) => {
  try {
    const { mission, unit, action } = req.body;
    const upperMission = mission?.toUpperCase();
    const upperUnit = unit?.toUpperCase();

    if (action === "add_mission") {
      let existing = await MissionUnit.findOne({ mission: upperMission });
      if (!existing) {
        await MissionUnit.create({ mission: upperMission, units: [] });
      }
    } else if (action === "delete_mission") {
      await MissionUnit.findOneAndDelete({ mission: upperMission });
    } else if (action === "add_unit") {
      await MissionUnit.findOneAndUpdate(
        { mission: upperMission },
        { $addToSet: { units: upperUnit } },
        { upsert: true },
      );
    } else if (action === "delete_unit") {
      await MissionUnit.findOneAndUpdate(
        { mission: upperMission },
        { $pull: { units: upperUnit } },
      );
    }

    res
      .status(200)
      .json({ success: true, message: "Mission units updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
