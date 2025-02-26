import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import {
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/create-comment", protectRoute, createComment); // http://localhost:3000/api/comment/create-comment

router.put("/update-comment/:id", protectRoute, updateComment); // http://localhost:3000/api/comment/update-comment/:id

router.delete("/delete-comment/:id", protectRoute, deleteComment); // http://localhost:3000/api/comment/delete-comment/:id

router.post("/like-comment/:id", protectRoute, likeComment); // http://localhost:3000/api/comment/like-comment/:id

router.post("/dislike-comment/:id", protectRoute, dislikeComment); // http://localhost:3000/api/comment/dislike-comment/:id

router.get("/get-comment/:blogId", getComment); // http://localhost:3000/api/comment/get-comment/:blogId

export default router;
