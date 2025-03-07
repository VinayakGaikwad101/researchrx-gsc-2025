import React, { useEffect, useState } from "react";
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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { ArrowLeft, Users } from "lucide-react";
import { toast } from "react-hot-toast";

const CreateGroup = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { researchers, fetchResearchers, createGroup } = useChatStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchResearchers();
  }, [fetchResearchers]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      setIsLoading(true);
      await createGroup({
        name,
        description,
        members: selectedMembers,
      });
      toast.success("Group created successfully");
      navigate("/chat");
    } catch (error) {
      toast.error("Failed to create group");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMember = (researcherId) => {
    setSelectedMembers((prev) =>
      prev.includes(researcherId)
        ? prev.filter((id) => id !== researcherId)
        : [...prev, researcherId]
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/chat")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <CardTitle>Create New Group</CardTitle>
            <CardDescription>
              Create a group chat with other researchers
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleCreateGroup} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group Name"
                required
              />
            </div>
            <div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Group Description (optional)"
                rows={3}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Select Members</h3>
            <ScrollArea className="h-[300px] border rounded-lg p-4">
              {researchers
                .filter((researcher) => researcher._id !== authUser?._id)
                .map((researcher) => (
                <div
                  key={researcher._id}
                  className="flex items-center space-x-4 py-2 border-b last:border-0"
                >
                  <Checkbox
                    id={researcher._id}
                    checked={selectedMembers.includes(researcher._id)}
                    onCheckedChange={() => toggleMember(researcher._id)}
                  />
                  <label
                    htmlFor={researcher._id}
                    className="flex items-center space-x-4 cursor-pointer flex-1"
                  >
                    <Avatar>
                      <AvatarImage src={researcher.photo} />
                      <AvatarFallback>
                        {researcher.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{researcher.name}</p>
                      <p className="text-sm text-gray-500">
                        {researcher.email}
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </ScrollArea>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedMembers.length} members
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !name.trim() || selectedMembers.length === 0}
          >
            <Users className="h-5 w-5 mr-2" />
            Create Group
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateGroup;
