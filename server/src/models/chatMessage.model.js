import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: { type: String, required: true },
  message: { type: String, required: true, trim: true },
  timestamp: { type: Date, default: Date.now },
});

chatMessageSchema.index({ session: 1, timestamp: 1 });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
