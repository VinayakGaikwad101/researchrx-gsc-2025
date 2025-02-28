import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
} from "../controllers/blog.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import protectRoleSpecificRoute from "../middlewares/protectRole.js";

const router = express.Router();

router.post("/create", protectRoute, protectRoleSpecificRoute, createBlog); // http://localhost:3000/api/blog/create
router.delete(
  "/delete/:blogId",
  protectRoute,
  protectRoleSpecificRoute,
  deleteBlog
); // http://localhost:3000/api/blog/delete/:blogId
router.get("/all", protectRoute, getAllBlogs); // http://localhost:3000/api/blog/all

router.get("/:blogId",  getBlogById); // http://localhost:3000/api/blog/:blogId

export default router;
