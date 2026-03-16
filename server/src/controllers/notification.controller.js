import Notification from "../models/notification.model.js";

// GET /notifications
export const getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Notification.countDocuments({ recipient: req.user._id }),
      Notification.countDocuments({ recipient: req.user._id, read: false }),
    ]);

    return res.status(200).json({ notifications, total, unreadCount, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[getMyNotifications]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: "Notification not found" });
    return res.status(200).json({ message: "Marked as read", notification: notif });
  } catch (error) {
    console.error("[markAsRead]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /notifications/read-all
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("[markAllRead]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
