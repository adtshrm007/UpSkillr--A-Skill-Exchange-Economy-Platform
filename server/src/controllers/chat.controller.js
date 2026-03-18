import ChatMessage from "../models/chatMessage.model.js";
import Session from "../models/session.model.js";

// GET /chat/:sessionId/history
export const getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);

    if (!session) return res.status(404).json({ message: "Session not found" });

    const userId = req.user._id;
    const isParticipant =
      session.teacher.equals(userId) || session.learner.equals(userId);
    if (!isParticipant)
      return res
        .status(403)
        .json({ message: "Not a participant in this session" });

    const messages = await ChatMessage.find({ session: sessionId })
      .sort({ timestamp: 1 })
      .lean();

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("[getChatHistory]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
