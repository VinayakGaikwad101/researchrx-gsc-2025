import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../../store/useChatStore.js";
import { useAuthStore } from "../../store/useAuthStore.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { ArrowLeft, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const UserList = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { 
    researchers, 
    fetchResearchers, 
    createDirectChat, 
    onlineUsers,
    isLoadingResearchers 
  } = useChatStore();

  useEffect(() => {
    fetchResearchers();
  }, [fetchResearchers]);

  const handleStartChat = async (researcherId) => {
    try {
      const chat = await createDirectChat(researcherId);
      navigate(`/chat`);
    } catch (error) {
      toast.error("Failed to start chat");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle>Researchers</CardTitle>
            <CardDescription>
              Start a conversation with other researchers
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)] relative">
          {isLoadingResearchers ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : researchers.length === 0 ? (
            <p className="text-center text-gray-500 mt-4">
              No other researchers found
            </p>
          ) : (
            researchers
              .filter((researcher) => researcher._id !== authUser?._id)
              .map((researcher) => (
                <div
                  key={researcher._id}
                  className="flex items-center justify-between py-4 border-b last:border-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={researcher.photo} />
                        <AvatarFallback>
                          {researcher.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {onlineUsers.has(researcher._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{researcher.name}</p>
                      <p className="text-sm text-gray-500">{researcher.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handleStartChat(researcher._id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UserList;
