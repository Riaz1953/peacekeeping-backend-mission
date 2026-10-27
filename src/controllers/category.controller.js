import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Get all categories (optional mission/unit filter support)
export const getCategories = asyncHandler(async (req, res) => {
  const { mission, unit } = req.query;
  let filter = {};
  if (mission) filter.mission = mission.toUpperCase();
  if (unit) filter.unit = unit.toUpperCase();

  const categories = await Category.find(filter).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// Add category under specific mission & unit
export const addCategory = asyncHandler(async (req, res) => {
  const { name, mission, unit } = req.body;
  if (!name || !mission || !unit) {
    throw new ApiError(400, "Category name, mission, and unit are required");
  }

  const trimmedName = name.toLowerCase().trim();
  const upperMission = mission.toUpperCase().trim();
  const upperUnit = unit.toUpperCase().trim();

  const existing = await Category.findOne({
    name: trimmedName,
    mission: upperMission,
    unit: upperUnit,
  });
  if (existing) {
    throw new ApiError(400, "Category already exists under this unit");
  }

  const category = await Category.create({
    name: trimmedName,
    mission: upperMission,
    unit: upperUnit,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, category, "Category added successfully under unit"),
    );
});

// Delete category
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, "Category not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});
