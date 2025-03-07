import React from "react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../../store/useChatStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Plus, Users, Loader2 } from "lucide-react";
import { format } from "date-fns";

const ChatList = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    directChats,
    groupChats,
    currentChat,
    setCurrentChat,
    onlineUsers,
    isLoadingChats,
  } = useChatStore();

  const getLastMessagePreview = (chat) => {
    if (!chat.lastMessage) return "No messages yet";
    if (chat.lastMessage.isDeleted) return "This message was deleted";
    if (chat.lastMessage.file) return "Shared a PDF file";
    return chat.lastMessage.content;
  };

  const getLastMessageTime = (chat) => {
    if (!chat.lastMessage) return "";
    return format(new Date(chat.lastMessage.createdAt), "MMM d, h:mm a");
  };

  const getChatName = (chat) => {
    if (chat.members) {
      // Group chat
      return chat.name;
    } else {
      // Direct chat
      const otherUser = chat.participants.find((p) => p._id !== authUser?._id);
      return otherUser?.name || "Unknown User";
    }
  };

  const getChatAvatar = (chat) => {
    if (chat.members) {
      // Group chat
      return chat.photo;
    } else {
      // Direct chat
      const otherUser = chat.participants.find((p) => p._id !== authUser?._id);
      return otherUser?.photo;
    }
  };

  const getAvatarFallback = (chat) => {
    if (chat.members) {
      // Group chat
      return chat.name.substring(0, 2).toUpperCase();
    } else {
      // Direct chat
      const otherUser = chat.participants.find((p) => p._id !== authUser?._id);
      return otherUser?.name?.substring(0, 2).toUpperCase() || "UN";
    }
  };

  const ChatItem = ({ chat }) => (
    <Card
      className={`mb-2 cursor-pointer hover:bg-gray-100 ${
        currentChat?._id === chat._id ? "bg-gray-100" : ""
      }`}
      onClick={() => setCurrentChat(chat)}
    >
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="relative">
          <Avatar>
            <AvatarImage src={getChatAvatar(chat)} />
            <AvatarFallback>{getAvatarFallback(chat)}</AvatarFallback>
          </Avatar>
          {!chat.members && onlineUsers.has(chat.participants.find(p => p._id !== authUser?._id)?._id) && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h4 className="text-sm font-semibold truncate">{getChatName(chat)}</h4>
            <span className="text-xs text-gray-500">
              {getLastMessageTime(chat)}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {getLastMessagePreview(chat)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-80 h-[calc(100vh-6rem)]">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Messages</CardTitle>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/chat/new")}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/chat/group/new")}
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>Your conversations</CardDescription>
      </CardHeader>
      <Tabs defaultValue="direct" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="direct" className="flex-1">
            Direct
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex-1">
            Groups
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <TabsContent value="direct" className="m-0 p-4 relative min-h-[100px]">
            {isLoadingChats ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <>
                {directChats.map((chat) => (
                  <ChatItem key={chat._id} chat={chat} />
                ))}
                {directChats.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">
                    No direct messages yet
                  </p>
                )}
              </>
            )}
          </TabsContent>
          <TabsContent value="groups" className="m-0 p-4 relative min-h-[100px]">
            {isLoadingChats ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <>
                {groupChats.map((chat) => (
                  <ChatItem key={chat._id} chat={chat} />
                ))}
                {groupChats.length === 0 && (
                  <p className="text-center text-gray-500 mt-4">
                    No group chats yet
                  </p>
                )}
              </>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
};

export default ChatList;
