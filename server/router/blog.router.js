import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
} from "../controllers/blog.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createBlog); // http://localhost:3000/api/blog/create
router.delete("/delete/:blogId", protectRoute, deleteBlog); // http://localhost:3000/api/blog/delete/:blogId
router.get("/all", getAllBlogs); // http://localhost:3000/api/blog/all

router.get("/:blogId", getBlogById); // http://localhost:3000/api/blog/:blogId

export default router;
