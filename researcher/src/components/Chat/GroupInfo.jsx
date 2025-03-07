import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  Camera,
  X,
  UserPlus,
  LogOut,
  Save,
  ArrowLeft,
  UserMinus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "react-hot-toast";

const GroupInfo = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    groupChats,
    researchers,
    updateGroup,
    updateGroupPhoto,
    addGroupMember,
    removeGroupMember,
    leaveGroup,
    fetchResearchers,
  } = useChatStore();

  const group = groupChats.find((g) => g._id === groupId);
  const isAdmin = group?.admin._id === authUser?._id;

  const [name, setName] = useState(group?.name || "");
  const [description, setDescription] = useState(group?.description || "");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResearchers();
  }, [fetchResearchers]);

  const handleUpdateGroup = async () => {
    try {
      await updateGroup(groupId, { name, description });
      setIsEditing(false);
      toast.success("Group updated successfully");
    } catch (error) {
      toast.error("Failed to update group");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await updateGroupPhoto(groupId, file);
      toast.success("Group photo updated successfully");
    } catch (error) {
      toast.error("Failed to update group photo");
    }
  };

  const handleAddMember = async (memberId) => {
    try {
      await addGroupMember(groupId, memberId);
      toast.success("Member added successfully");
    } catch (error) {
      toast.error("Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeGroupMember(groupId, memberId);
      toast.success("Member removed successfully");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(groupId);
      navigate("/chat");
      toast.success("Left group successfully");
    } catch (error) {
      toast.error("Failed to leave group");
    }
  };

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/chat")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle>Group Information</CardTitle>
          {isAdmin && isEditing && (
            <Button onClick={handleUpdateGroup}>
              <Save className="h-5 w-5 mr-2" />
              Save
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={group.photo} />
              <AvatarFallback>
                {group.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isAdmin && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </>
            )}
          </div>

          {isEditing ? (
            <div className="w-full space-y-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group Name"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Group Description"
              />
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-semibold">{group.name}</h3>
              <p className="text-gray-500">{group.description}</p>
              {isAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="mt-2"
                >
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Members ({group.members.length})
            </h3>
            {isAdmin && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Members</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[300px] pr-4">
                    {researchers
                      .filter(
                        (r) =>
                          !group.members.some((m) => m._id === r._id)
                      )
                      .map((researcher) => (
                        <div
                          key={researcher._id}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={researcher.photo} />
                              <AvatarFallback>
                                {researcher.name
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {researcher.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {researcher.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() =>
                              handleAddMember(researcher._id)
                            }
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <ScrollArea className="h-[300px]">
            {group.members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.photo} />
                    <AvatarFallback>
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.name}{" "}
                      {member._id === group.admin._id && (
                        <span className="text-sm text-blue-500">
                          (Admin)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {member.email}
                    </p>
                  </div>
                </div>
                {isAdmin && member._id !== authUser?._id && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveMember(member._id)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>

        {!isAdmin && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLeaveGroup}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Leave Group
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupInfo;
