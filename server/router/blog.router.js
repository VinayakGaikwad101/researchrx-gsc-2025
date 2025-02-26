import express from "express";
import {
  createBlog,
  previewBlog,
  getBlogs,
} from "../controllers/blog.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import { requireResearcher } from "../middlewares/protectRole.js";
import upload from "../config/multer.config.js";

const router = express.Router();

router.post(
  "/create-blog",
  protectRoute,
  requireResearcher,
  upload.array("image"),
  createBlog
); // http://localhost:3000/api/blog/create-blog

router.post(
  "/preview-blog",
  protectRoute,
  requireResearcher,
  upload.array("images"),
  previewBlog
); // http://localhost:3000/api/blog/preview-blog

router.get("/get-blogs", protectRoute, getBlogs); // http://localhost:3000/api/blog/get-blogs

export default router;
