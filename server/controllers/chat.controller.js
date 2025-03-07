import Chat from "../models/chat.model.js";
import Group from "../models/group.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.config.js";

// Direct Chat Controllers
export const createDirectChat = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user.id;

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (existingChat) {
      const populatedChat = await Chat.findById(existingChat._id)
        .populate({
          path: "participants",
          select: "firstName lastName email avataar",
          transform: doc => ({
            _id: doc._id,
            name: `${doc.firstName} ${doc.lastName}`,
            email: doc.email,
            photo: doc.avataar || "default_avatar.png"
          })
        })
        .populate({
          path: "lastMessage",
          populate: {
            path: "sender",
            select: "firstName lastName email avataar",
            transform: doc => ({
              _id: doc._id,
              name: `${doc.firstName} ${doc.lastName}`,
              email: doc.email,
              photo: doc.avataar || "default_avatar.png"
            })
          }
        });
      return res.status(200).json(populatedChat);
    }

    const newChat = await Chat.create({
      participants: [senderId, recipientId],
    });

    const populatedNewChat = await Chat.findById(newChat._id)
      .populate({
        path: "participants",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      });

    return res.status(201).json(populatedNewChat);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get direct chats
    const directChats = await Chat.find({ participants: userId })
      .populate({
        path: "participants",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstName lastName email avataar",
          transform: doc => ({
            _id: doc._id,
            name: `${doc.firstName} ${doc.lastName}`,
            email: doc.email,
            photo: doc.avataar || "default_avatar.png"
          })
        }
      });

    // Get group chats
    const groupChats = await Group.find({ members: userId })
      .populate({
        path: "admin",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      })
      .populate({
        path: "members",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstName lastName email avataar",
          transform: doc => ({
            _id: doc._id,
            name: `${doc.firstName} ${doc.lastName}`,
            email: doc.email,
            photo: doc.avataar || "default_avatar.png"
          })
        }
      });

    return res.status(200).json({
      directChats,
      groupChats,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Group Chat Controllers
export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const adminId = req.user.id;

    const newGroup = await Group.create({
      name,
      description,
      admin: adminId,
      members: [...members, adminId],
    });

    const populatedGroup = await Group.findById(newGroup._id)
      .populate({
        path: "admin",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      })
      .populate({
        path: "members",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      });

    return res.status(201).json(populatedGroup);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: "Only admin can update group" });
    }

    group.name = name || group.name;
    group.description = description || group.description;
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate({
        path: "admin",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      })
      .populate({
        path: "members",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      });

    return res.status(200).json(updatedGroup);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateGroupPhoto = async (req, res) => {
  try {
    const { groupId } = req.params;
    const adminId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: "Only admin can update group photo" });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "group_photos",
    });

    group.photo = result.secure_url;
    await group.save();

    return res.status(200).json({ photo: result.secure_url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: "Only admin can add members" });
    }

    if (group.members.includes(memberId)) {
      return res.status(400).json({ error: "User already in group" });
    }

    group.members.push(memberId);
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate({
        path: "admin",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      })
      .populate({
        path: "members",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      });

    return res.status(200).json(updatedGroup);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const adminId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() !== adminId) {
      return res.status(403).json({ error: "Only admin can remove members" });
    }

    if (memberId === adminId) {
      return res.status(400).json({ error: "Admin cannot be removed" });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate({
        path: "admin",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      })
      .populate({
        path: "members",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      });

    return res.status(200).json(updatedGroup);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (group.admin.toString() === userId) {
      return res.status(400).json({ error: "Admin cannot leave group" });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );
    await group.save();

    return res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Message Controllers
export const sendMessage = async (req, res) => {
  try {
    const { content, chatId, chatType } = req.body;
    const senderId = req.user.id;

    let chat;
    if (chatType === "direct") {
      chat = await Chat.findById(chatId);
    } else {
      chat = await Group.findById(chatId);
    }

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      content,
      chatType,
      chat: chatId,
    });

    // Update last message
    chat.lastMessage = newMessage._id;
    await chat.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate({
        path: "sender",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      });

    // Get io instance and emit to appropriate rooms
    const io = req.app.get('io');
    if (chatType === "direct") {
      // Get recipient ID
      const recipientId = chat.participants.find(id => id.toString() !== senderId);
      // Emit to recipient's room
      io.to(recipientId.toString()).emit("receive_message", populatedMessage);
      // Emit to sender's room
      io.to(senderId).emit("receive_message", populatedMessage);
    } else {
      // Emit to group room
      io.to(chatId).emit("receive_message", populatedMessage);
    }

    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId, chatType } = req.params;

    const messages = await Message.find({
      chat: chatId,
      chatType,
    })
      .populate({
        path: "sender",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      })
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ error: "Can only delete own messages" });
    }

    message.isDeleted = true;
    message.content = "This message was deleted";
    await message.save();

    // Get io instance and emit delete event
    const io = req.app.get('io');
    if (message.chatType === "direct") {
      const chat = await Chat.findById(message.chat);
      const recipientId = chat.participants.find(id => id.toString() !== userId);
      // Emit to recipient's room
      io.to(recipientId.toString()).emit("message_deleted", messageId);
      // Emit to sender's room
      io.to(userId).emit("message_deleted", messageId);
    } else {
      // Emit to group room
      io.to(message.chat.toString()).emit("message_deleted", messageId);
    }

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const { chatId, chatType } = req.params;
    const senderId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check file type
    if (!req.file.mimetype.includes("pdf")) {
      return res.status(400).json({ error: "Only PDF files are allowed" });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "chat_files",
    });

    const newMessage = await Message.create({
      sender: senderId,
      content: "Shared a PDF file",
      file: result.secure_url,
      chatType,
      chat: chatId,
    });

    // Update last message
    if (chatType === "direct") {
      await Chat.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });
    } else {
      await Group.findByIdAndUpdate(chatId, { lastMessage: newMessage._id });
    }

    const populatedMessage = await Message.findById(newMessage._id)
      .populate({
        path: "sender",
        select: "firstName lastName email avataar",
        transform: doc => ({
          _id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          photo: doc.avataar || "default_avatar.png"
        })
      });

    // Get io instance and emit to appropriate rooms
    const io = req.app.get('io');
    if (chatType === "direct") {
      const chat = await Chat.findById(chatId);
      const recipientId = chat.participants.find(id => id.toString() !== senderId);
      // Emit to recipient's room
      io.to(recipientId.toString()).emit("receive_message", populatedMessage);
      // Emit to sender's room
      io.to(senderId).emit("receive_message", populatedMessage);
    } else {
      // Emit to group room
      io.to(chatId).emit("receive_message", populatedMessage);
    }

    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all researchers for chat
export const getResearchers = async (req, res) => {
  try {
    const userId = req.user.id;

    const researchers = await User.find({
      _id: { $ne: userId },
      role: "Researcher",
      isVerified: true
    }).select("firstName lastName email avataar");

    // Format the response to match the expected structure
    const formattedResearchers = researchers.map(researcher => ({
      _id: researcher._id,
      name: `${researcher.firstName} ${researcher.lastName}`,
      email: researcher.email,
      photo: researcher.avataar || "default_avatar.png"
    }));

    return res.status(200).json(formattedResearchers);
  } catch (error) {
    console.error("Error fetching researchers:", error);
    return res.status(500).json({ error: "Failed to fetch researchers" });
  }
};
