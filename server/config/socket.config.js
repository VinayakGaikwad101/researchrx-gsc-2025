import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const connectedUsers = new Map(); // Store online users

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.RESEARCHER_CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    connectedUsers.set(socket.user.id, socket.id);

    // Join personal room for private messages
    socket.join(socket.user.id);

    // Send list of currently online users
    io.emit("online_users", Array.from(connectedUsers.keys()));

    // Handle joining group chats
    socket.on("join_group", (groupId) => {
      socket.join(groupId);
    });

    // Handle new messages
    socket.on("send_message", async (data) => {
      if (data.chatType === "direct") {
        // Broadcast to both sender and recipient
        io.to([socket.user.id, data.recipientId]).emit("receive_message", {
          ...data,
          senderId: socket.user.id
        });
      } else if (data.chatType === "group") {
        // Broadcast to the entire group
        io.to(data.groupId).emit("receive_message", {
          ...data,
          senderId: socket.user.id
        });
      }
    });

    // Handle message deletion
    socket.on("delete_message", (data) => {
      if (data.chatType === "direct") {
        io.to([socket.user.id, data.recipientId]).emit("message_deleted", data.messageId);
      } else if (data.chatType === "group") {
        io.to(data.groupId).emit("message_deleted", data.messageId);
      }
    });

    // Handle typing status
    socket.on("typing", (data) => {
      if (data.chatType === "direct") {
        socket.to(data.recipientId).emit("user_typing", {
          userId: socket.user.id,
          chatId: data.recipientId
        });
      } else if (data.chatType === "group") {
        socket.to(data.groupId).emit("user_typing", {
          userId: socket.user.id,
          chatId: data.groupId
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
      connectedUsers.delete(socket.user.id);
      io.emit("online_users", Array.from(connectedUsers.keys()));
    });
  });

  return io;
};
