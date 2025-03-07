import express from "express";
import {
  createDirectChat,
  getUserChats,
  createGroup,
  updateGroup,
  updateGroupPhoto,
  addGroupMember,
  removeGroupMember,
  leaveGroup,
  sendMessage,
  getChatMessages,
  deleteMessage,
  uploadFile,
  getResearchers,
} from "../controllers/chat.controller.js";
import {protectRoute} from "../middlewares/protectRoute.middleware.js";
import protectRoleSpecificRoute from "../middlewares/protectRole.js";
import upload from "../config/multer.config.js";

const router = express.Router();

// Apply middleware to all routes
router.use(protectRoute);
router.use(protectRoleSpecificRoute);

// Direct chat routes
router.post("/direct", createDirectChat);
router.get("/list", getUserChats);
router.get("/researchers", getResearchers);

// Group chat routes
router.post("/group", createGroup);
router.put("/group/:groupId", updateGroup);
router.put(
  "/group/:groupId/photo",
  upload.single("photo"),
  updateGroupPhoto
);
router.post("/group/:groupId/members", addGroupMember);
router.delete("/group/:groupId/members/:memberId", removeGroupMember);
router.delete("/group/:groupId/leave", leaveGroup);

// Message routes
router.post("/message", sendMessage);
router.get("/messages/:chatId/:chatType", getChatMessages);
router.delete("/message/:messageId", deleteMessage);
router.post(
  "/upload/:chatId/:chatType",
  upload.single("file"),
  uploadFile
);

export default router;
