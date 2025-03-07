import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import useChatStore from "../../store/useChatStore.js";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const Chat = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { initializeSocket, fetchChats, cleanup } = useChatStore();

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    } else {
      const token = localStorage.getItem("authToken");
      if (token) {
        initializeSocket(token);
        fetchChats();
      }
    }
    return () => {
      cleanup();
    };
  }, [authUser, navigate, initializeSocket, fetchChats, cleanup]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 h-[calc(100vh-6rem)]">
        <ChatList />
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
