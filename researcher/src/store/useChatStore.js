import { create } from "zustand";
import axios from "axios";
import { io } from "socket.io-client";
import { playNotificationSound } from "../assets/sounds/notification";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const useChatStore = create((set, get) => ({
  socket: null,
  directChats: [],
  groupChats: [],
  currentChat: null,
  messages: [],
  researchers: [],
  isLoadingMessages: false,
  isLoadingChats: false,
  isLoadingResearchers: false,
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
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected");
      const { currentChat } = get();
      if (currentChat?.members) {
        socket.emit("join_group", currentChat._id);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      // Retry connection with exponential backoff
      socket.io.opts.reconnectionDelay *= 2;
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      socket.io.opts.reconnectionDelay = 1000; // Reset delay
      const { currentChat } = get();
      if (currentChat?.members) {
        socket.emit("join_group", currentChat._id);
      }
    });

    socket.on("online_users", (users) => {
      set((state) => {
        const newState = { ...state };
        newState.onlineUsers = new Set(users);
        return newState;
      });
    });

    // Handle incoming messages
    socket.on("receive_message", (message) => {
      console.log("Received message:", message);
      
      set((state) => {
        // Create a new state object
        const newState = { ...state };

        // Update chat lists
        const updateChat = (chat) => 
          chat._id === message.chat ? { ...chat, lastMessage: message } : chat;

        newState.directChats = state.directChats.map(updateChat);
        newState.groupChats = state.groupChats.map(updateChat);

        // Update messages if we're in the relevant chat
        if (state.currentChat && message.chat === state.currentChat._id) {
          // Avoid duplicate messages
          const messageExists = state.messages.some(msg => msg._id === message._id);
          if (!messageExists) {
            newState.messages = [...state.messages, message];
          }
        }

        return newState;
      });

      // Play notification sound for incoming messages
      if (message.senderId !== get().socket?.auth?.userId) {
        playNotificationSound();
      }
    });

    socket.on("message_deleted", (messageId) => {
      set((state) => {
        const newState = { ...state };
        newState.messages = state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, isDeleted: true, content: "This message was deleted" }
            : msg
        );
        return newState;
      });
    });

    socket.on("user_typing", ({ userId, chatId }) => {
      const { currentChat } = get();
      if (currentChat && currentChat._id === chatId) {
        get().setTypingUser(userId);
      }
    });

    set((state) => {
      const newState = { ...state };
      newState.socket = socket;
      return newState;
    });
  },

  // Researcher Management
  fetchResearchers: async () => {
    try {
      set((state) => {
        const newState = { ...state };
        newState.isLoadingResearchers = true;
        return newState;
      });

      const response = await axios.get(`${SERVER_URL}/api/chat/researchers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        withCredentials: true,
      });

      set((state) => {
        const newState = { ...state };
        newState.researchers = response.data;
        newState.isLoadingResearchers = false;
        return newState;
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching researchers:", error);
      set((state) => {
        const newState = { ...state };
        newState.isLoadingResearchers = false;
        return newState;
      });
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
      set((state) => {
        const newState = { ...state };
        newState.groupChats = [...state.groupChats, response.data];
        newState.currentChat = response.data;
        return newState;
      });

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
      set((state) => {
        const newState = { ...state };
        newState.directChats = [...state.directChats, response.data];
        newState.currentChat = response.data;
        return newState;
      });
      return response.data;
    } catch (error) {
      console.error("Error creating direct chat:", error);
      throw error;
    }
  },

  fetchChats: async () => {
    try {
      set((state) => {
        const newState = { ...state };
        newState.isLoadingChats = true;
        newState.directChats = [];
        newState.groupChats = [];
        return newState;
      });

      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${SERVER_URL}/api/chat/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      set((state) => {
        const newState = { ...state };
        newState.directChats = response.data.directChats;
        newState.groupChats = response.data.groupChats;
        newState.isLoadingChats = false;
        return newState;
      });
    } catch (error) {
      console.error("Error fetching chats:", error);
      set((state) => {
        const newState = { ...state };
        newState.isLoadingChats = false;
        return newState;
      });
      throw error;
    }
  },

  // Message Management
  fetchMessages: async (chatId, chatType) => {
    try {
      set((state) => {
        const newState = { ...state };
        newState.isLoadingMessages = true;
        return newState;
      });

      const response = await axios.get(
        `${SERVER_URL}/api/chat/messages/${chatId}/${chatType}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      set((state) => {
        const newState = { ...state };
        newState.messages = response.data;
        newState.isLoadingMessages = false;
        return newState;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set((state) => {
        const newState = { ...state };
        newState.isLoadingMessages = false;
        return newState;
      });
    }
  },

  uploadFile: async (file, chatId, chatType) => {
    try {
      const { currentChat } = get();
      const recipientId = chatType === "direct" 
        ? currentChat.participants.find(p => p._id !== get().socket?.auth?.userId)?._id 
        : undefined;

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
      set((state) => {
        const newState = { ...state };
        newState.messages = [...state.messages, response.data];
        return newState;
      });

      // Update chat lists with immutable state update
      set((state) => {
        const newState = { ...state };
        
        if (chatType === "direct") {
          newState.directChats = state.directChats.map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage: response.data } : chat
          );
        } else {
          newState.groupChats = state.groupChats.map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage: response.data } : chat
          );
        }
        
        return newState;
      });

      // Emit to socket
      const { socket } = get();
      if (socket) {
        socket.emit("send_message", {
          ...response.data,
          chatType,
          chat: chatId,
          recipientId,
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
      const { currentChat } = get();
      const recipientId = chatType === "direct" 
        ? currentChat.participants.find(p => p._id !== get().socket?.auth?.userId)?._id 
        : undefined;

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
      set((state) => {
        const newState = { ...state };
        newState.messages = [...state.messages, response.data];
        return newState;
      });

      // Update chat lists with immutable state update
      set((state) => {
        const newState = { ...state };
        
        if (chatType === "direct") {
          newState.directChats = state.directChats.map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage: response.data } : chat
          );
        } else {
          newState.groupChats = state.groupChats.map((chat) =>
            chat._id === chatId ? { ...chat, lastMessage: response.data } : chat
          );
        }
        
        return newState;
      });

      // Emit to socket
      const { socket } = get();
      if (socket) {
        socket.emit("send_message", {
          ...response.data,
          chatType,
          chat: chatId,
          recipientId,
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
      const { socket, currentChat } = get();
      const chatType = currentChat.members ? "group" : "direct";
      const recipientId = chatType === "direct"
        ? currentChat.participants.find(p => p._id !== socket.auth.userId)?._id
        : undefined;

      const response = await axios.delete(
        `${SERVER_URL}/api/chat/message/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        }
      );

      // Update messages with immutable state update
      set((state) => {
        const newState = { ...state };
        newState.messages = state.messages.map((msg) =>
          msg._id === messageId
            ? { ...msg, isDeleted: true, content: "This message was deleted" }
            : msg
        );
        return newState;
      });

      // Emit to socket
      if (socket) {
        socket.emit("delete_message", {
          messageId,
          chatType,
          recipientId,
          groupId: chatType === "group" ? currentChat._id : undefined,
        });
      }

      return response.data;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  // UI State Management
  setCurrentChat: (chat) => {
    set((state) => {
      const newState = { ...state };
      newState.currentChat = chat;
      newState.messages = [];
      return newState;
    });

    if (chat) {
      get().fetchMessages(chat._id, chat.members ? "group" : "direct")
        .catch(() => {
          // Reset loading state in case of error
          set((state) => {
            const newState = { ...state };
            newState.isLoadingMessages = false;
            return newState;
          });
        });
      const { socket } = get();
      if (socket && chat.members) {
        socket.emit("join_group", chat._id);
      }
    }
  },

  setTypingUser: (userId) => {
    const typingTimeout = setTimeout(() => {
      set((state) => {
        const newState = { ...state };
        newState.typingUsers = new Map(state.typingUsers);
        newState.typingUsers.delete(userId);
        return newState;
      });
    }, 3000);

    set((state) => {
      const newState = { ...state };
      newState.typingUsers = new Map(state.typingUsers);
      newState.typingUsers.set(userId, typingTimeout);
      return newState;
    });
  },

  emitTyping: (chatId, chatType) => {
    const { socket, currentChat } = get();
    if (socket) {
      const recipientId = chatType === "direct"
        ? currentChat.participants.find(p => p._id !== socket.auth.userId)?._id
        : undefined;

      socket.emit("typing", {
        chatType,
        recipientId,
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
    
    set((state) => {
      const newState = { ...state };
      newState.socket = null;
      newState.directChats = [];
      newState.groupChats = [];
      newState.currentChat = null;
      newState.messages = [];
      newState.researchers = [];
      newState.isLoadingMessages = false;
      newState.isLoadingChats = false;
      newState.isLoadingResearchers = false;
      newState.typingUsers = new Map();
      newState.onlineUsers = new Set();
      return newState;
    });
  },
}));

export default useChatStore;
