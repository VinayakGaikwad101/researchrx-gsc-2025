import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Ensure exactly 2 participants for direct chat
chatSchema.pre("save", function (next) {
  if (this.participants.length !== 2) {
    next(new Error("Direct chat must have exactly 2 participants"));
  }
  next();
});

// Create unique compound index on participants to prevent duplicate chats
chatSchema.index({ participants: 1 }, { unique: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
