import { Router } from "express";
import {
  getCategories,
  addCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.route("/").get(getCategories).post(addCategory);
router.route("/:id").delete(deleteCategory);

export default router;
