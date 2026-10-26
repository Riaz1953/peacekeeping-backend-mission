import { Router } from "express";
import {
  uploadMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  toggleLike,
  getMissionsAndUnits,
  manageMissionUnit,
} from "../controllers/media.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Config routes for missions and units
router
  .route("/config/missions-units")
  .get(getMissionsAndUnits)
  .post(manageMissionUnit);

// Create media and Get all media
router.route("/").post(upload.single("file"), uploadMedia).get(getAllMedia);

// Get single media, Update media, and Delete media
router
  .route("/:id")
  .get(getMediaById)
  .put(upload.single("file"), updateMedia)
  .delete(deleteMedia);

// Like toggle route
router.route("/:id/like").patch(toggleLike);

export default router;
