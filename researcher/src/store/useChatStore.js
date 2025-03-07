import { create } from "zustand";
import axios from "axios";
import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const useChatStore = create((set, get) => ({
  socket: null,
  directChats: [],
  groupChats: [],
  currentChat: null,
  messages: [],
  researchers: [],
  isLoading: false,
  typingUsers: new Map(),
  onlineUsers: new Set(),

  // Socket Connection
  initializeSocket: (token) => {
    if (get().socket) {
      get().socket.disconnect();
    }

    const socket = io(SERVER_URL, {
      auth: { token },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      const { currentChat } = get();
      if (currentChat?.members) {
        socket.emit("join_group", currentChat._id);
      }
    });

    socket.on("online_users", (users) => {
      set({ onlineUsers: new Set(users) });
    });

    // Handle incoming messages
    socket.on("receive_message", (message) => {
      console.log("Received message:", message);
      const { currentChat } = get();
      
      // Update messages if in current chat
      if (currentChat && message.chat === currentChat._id) {
        set((state) => ({
          messages: [...state.messages.filter(m => !m.isOptimistic), message]
        }));
      }

      // Update chat lists
      set((state) => {
        const updateChat = (chat) => 
          chat._id === message.chat ? { ...chat, lastMessage: message } : chat;

        return {
          directChats: state.directChats.map(updateChat),
          groupChats: state.groupChats.map(updateChat)
        };
      });
    });

    socket.on("message_deleted", (messageId) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, isDeleted: true, content: "This message was deleted" }
            : msg
        ),
      }));
    });

    socket.on("user_typing", ({ userId, chatId }) => {
      const { currentChat } = get();
      if (currentChat && currentChat._id === chatId) {
        get().setTypingUser(userId);
      }
    });

    set({ socket });
  },

  // Researcher Management
  fetchResearchers: async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/chat/researchers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      });
      set({ researchers: response.data });
      return response.data;
    } catch (error) {
      console.error("Error fetching researchers:", error);
      throw error;
    }
  },

  // Group Management
  createGroup: async ({ name, description, members }) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/chat/group`,
        { name, description, members },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      // Update group chats list
      set((state) => ({
        groupChats: [...state.groupChats, response.data],
        currentChat: response.data,
      }));

      // Join the socket room for the new group
      const { socket } = get();
      if (socket) {
        socket.emit("join_group", response.data._id);
      }

      return response.data;
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  },

  // Chat Management
  createDirectChat: async (recipientId) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/chat/direct`,
        { recipientId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      set((state) => ({
        directChats: [...state.directChats, response.data],
        currentChat: response.data,
      }));
      return response.data;
    } catch (error) {
      console.error("Error creating direct chat:", error);
      throw error;
    }
  },

  fetchChats: async () => {
    try {
      set({ isLoading: true });
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${SERVER_URL}/api/chat/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      const { directChats, groupChats } = response.data;
      set({ directChats, groupChats, isLoading: false });
    } catch (error) {
      console.error("Error fetching chats:", error);
      set({ isLoading: false });
    }
  },

  // Message Management
  fetchMessages: async (chatId, chatType) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${SERVER_URL}/api/chat/messages/${chatId}/${chatType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );
      set({ messages: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ isLoading: false });
    }
  },

  uploadFile: async (file, chatId, chatType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${SERVER_URL}/api/chat/upload/${chatId}/${chatType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      // Update messages immediately
      set((state) => ({
        messages: [...state.messages, response.data]
      }));

      // Update chat lists
      set((state) => {
        if (chatType === "direct") {
          const updatedDirectChats = state.directChats.map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage: response.data } : chat
          );
          return { directChats: updatedDirectChats };
        } else {
          const updatedGroupChats = state.groupChats.map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage: response.data } : chat
          );
          return { groupChats: updatedGroupChats };
        }
      });

      // Emit to socket
      const { socket } = get();
      if (socket) {
        socket.emit("send_message", {
          ...response.data,
          chatType,
          chat: chatId,
          recipientId: chatType === "direct" ? chatId : undefined,
          groupId: chatType === "group" ? chatId : undefined,
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  sendMessage: async (content, chatId, chatType) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/chat/message`,
        { content, chatId, chatType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      // Update messages immediately
      set((state) => ({
        messages: [...state.messages, response.data]
      }));

      // Update chat lists
      set((state) => {
        if (chatType === "direct") {
          const updatedDirectChats = state.directChats.map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage: response.data } : chat
          );
          return { directChats: updatedDirectChats };
        } else {
          const updatedGroupChats = state.groupChats.map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage: response.data } : chat
          );
          return { groupChats: updatedGroupChats };
        }
      });

      // Emit to socket
      const { socket } = get();
      if (socket) {
        socket.emit("send_message", {
          ...response.data,
          chatType,
          chat: chatId,
          recipientId: chatType === "direct" ? chatId : undefined,
          groupId: chatType === "group" ? chatId : undefined,
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  deleteMessage: async (messageId) => {
    try {
      const response = await axios.delete(
        `${SERVER_URL}/api/chat/message/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      const { socket, currentChat } = get();
      if (socket) {
        socket.emit("delete_message", {
          messageId,
          chatType: currentChat.members ? "group" : "direct",
          recipientId: currentChat.members
            ? undefined
            : currentChat.participants.find((p) => p._id !== socket.auth.userId)
                ?._id,
          groupId: currentChat.members ? currentChat._id : undefined,
        });
      }

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, isDeleted: true, content: "This message was deleted" }
            : msg
        ),
      }));

      return response.data;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  // UI State Management
  setCurrentChat: (chat) => {
    set({ currentChat: chat });
    if (chat) {
      get().fetchMessages(chat._id, chat.members ? "group" : "direct");
      const { socket } = get();
      if (socket && chat.members) {
        socket.emit("join_group", chat._id);
      }
    }
  },

  setTypingUser: (userId) => {
    const typingTimeout = setTimeout(() => {
      set((state) => {
        const newTypingUsers = new Map(state.typingUsers);
        newTypingUsers.delete(userId);
        return { typingUsers: newTypingUsers };
      });
    }, 3000);

    set((state) => {
      const newTypingUsers = new Map(state.typingUsers);
      newTypingUsers.set(userId, typingTimeout);
      return { typingUsers: newTypingUsers };
    });
  },

  emitTyping: (chatId, chatType) => {
    const { socket } = get();
    if (socket) {
      socket.emit("typing", {
        chatType,
        recipientId: chatType === "direct" ? chatId : undefined,
        groupId: chatType === "group" ? chatId : undefined,
      });
    }
  },

  cleanup: () => {
    const { socket, typingUsers } = get();
    if (socket) {
      socket.disconnect();
    }
    typingUsers.forEach((timeout) => clearTimeout(timeout));
    set({
      socket: null,
      directChats: [],
      groupChats: [],
      currentChat: null,
      messages: [],
      researchers: [],
      isLoading: false,
      typingUsers: new Map(),
      onlineUsers: new Set(),
    });
  },
}));

export default useChatStore;
