import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chatType: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "chatType",
      required: true,
    },
    file: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for determining the model to use for chat reference
messageSchema.virtual("chatModel").get(function () {
  return this.chatType === "direct" ? "Chat" : "Group";
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
