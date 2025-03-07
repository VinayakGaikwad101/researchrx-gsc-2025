import React, { useEffect, useRef, useState } from "react";
import useChatStore from "../../store/useChatStore.js";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import { playNotificationSound } from "../../assets/sounds/notification.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import {
  MoreVertical,
  Send,
  File,
  Trash2,
  FileText,
  Users,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

const ChatWindow = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    currentChat,
    messages,
    sendMessage,
    deleteMessage,
    uploadFile,
    emitTyping,
    typingUsers,
    socket,
    initializeSocket,
    isLoadingMessages,
  } = useChatStore();
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

  // Initialize socket connection and set up polling
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && !socket) {
      initializeSocket(token);
    }

    if (currentChat) {
      const chatType = currentChat.members ? "group" : "direct";
      
      // Function to fetch messages without loading state
      const fetchLatestMessages = async () => {
        await useChatStore.getState().fetchMessages(currentChat._id, chatType, false);
        scrollToBottom();
      };

      // Initial fetch
      fetchLatestMessages();

      // Set up 5-second polling
      const pollInterval = setInterval(fetchLatestMessages, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [currentChat, socket]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Scroll to bottom on initial load and when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom when chat changes
  useEffect(() => {
    scrollToBottom();
  }, [currentChat]);

  // Auto-scroll when typing users change
  useEffect(() => {
    scrollToBottom();
  }, [typingUsers]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      await sendMessage(
        newMessage,
        currentChat._id,
        currentChat.members ? "group" : "direct"
      );
      setNewMessage("");
      playNotificationSound();
      scrollToBottom();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    try {
      setIsUploading(true);
      await uploadFile(
        file,
        currentChat._id,
        currentChat.members ? "group" : "direct"
      );
      playNotificationSound();
      toast.success("File uploaded successfully");
      scrollToBottom();
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    emitTyping(currentChat._id, currentChat.members ? "group" : "direct");
  };

  const getChatName = () => {
    if (!currentChat) return "";
    if (currentChat.members) {
      return currentChat.name;
    } else {
      const otherUser = currentChat.participants.find(
        (p) => p._id !== authUser?._id
      );
      return otherUser?.name || "Unknown User";
    }
  };

  const getChatAvatar = () => {
    if (!currentChat) return "";
    if (currentChat.members) {
      return currentChat.photo;
    } else {
      const otherUser = currentChat.participants.find(
        (p) => p._id !== authUser?._id
      );
      return otherUser?.photo;
    }
  };

  const getAvatarFallback = () => {
    if (!currentChat) return "CH";
    if (currentChat.members) {
      return currentChat.name.substring(0, 2).toUpperCase();
    } else {
      const otherUser = currentChat.participants.find(
        (p) => p._id !== authUser?._id
      );
      return otherUser?.name?.substring(0, 2).toUpperCase() || "UN";
    }
  };

  const MessageBubble = ({ message }) => {
    const isOwnMessage = message.sender._id === authUser?._id;

    return (
      <div
        className={`flex ${
          isOwnMessage ? "justify-end" : "justify-start"
        } mb-4 group`}
      >
        {!isOwnMessage && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={message.sender.photo} />
            <AvatarFallback>
              {message.sender.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`max-w-[70%] ${
            isOwnMessage ? "bg-blue-500 text-white" : "bg-gray-100"
          } rounded-lg p-3 relative`}
        >
          {!isOwnMessage && (
            <p className="text-xs text-gray-500 mb-1">{message.sender.name}</p>
          )}
          {message.isDeleted ? (
            <p className="text-sm whitespace-pre-wrap break-words">
              This message was deleted for all
            </p>
          ) : message.file ? (
            <a
              href={message.file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm hover:underline"
            >
              <FileText className="h-4 w-4" />
              <span>View PDF</span>
            </a>
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs opacity-70">
              {format(new Date(message.createdAt), "h:mm a")}
            </span>
          {isOwnMessage && !message.isDeleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute -left-10 top-1 z-50 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full p-1"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="z-50">
                  <DropdownMenuItem onClick={() => handleDeleteMessage(message._id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete for all
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!currentChat) {
    return (
      <Card className="w-full h-[calc(100vh-6rem)] flex items-center justify-center">
        <CardContent>
          <p className="text-gray-500">Select a chat to start messaging</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[calc(100vh-6rem)] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={getChatAvatar()} />
              <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{getChatName()}</CardTitle>
              {currentChat.members && (
                <p className="text-sm text-gray-500">
                  {currentChat.members.length} members
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {currentChat.members && (
                <DropdownMenuItem
                  onClick={() =>
                    navigate(`/chat/group/${currentChat._id}/info`)
                  }
                >
                  <Users className="h-4 w-4 mr-2" />
                  Group Info
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 relative">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
        {Array.from(typingUsers.keys()).map((userId) => {
          const typingUser = currentChat.members?.find(
            (m) => m._id === userId
          ) || currentChat.participants?.find((p) => p._id === userId);
          if (typingUser && typingUser._id !== authUser?._id) {
            return (
              <p
                key={userId}
                className="text-sm text-gray-500 italic ml-4 mb-2"
              >
                {typingUser.name} is typing...
              </p>
            );
          }
          return null;
        })}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <CardContent className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isSending}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isUploading || isSending}
            onClick={() => fileInputRef.current?.click()}
          >
            <File className="h-5 w-5" />
          </Button>
          <Button 
            type="submit" 
            disabled={!newMessage.trim() || isUploading || isSending}
            className="relative"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
