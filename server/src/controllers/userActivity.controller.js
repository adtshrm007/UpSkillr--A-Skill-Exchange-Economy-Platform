import UserActivity from "../models/userActivity.model.js";

// POST /activity/ping
export const pingActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split("T")[0];

    await UserActivity.findOneAndUpdate(
      { userId, date: today },
      { $inc: { minutesSpent: 1 } },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Activity logged" });
  } catch (error) {
    console.error("[pingActivity]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /activity/stats
export const getActivityStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 7 } = req.query;
    
    // Get last 'days' of activity
    const activity = await UserActivity.find({ userId })
      .sort({ date: -1 })
      .limit(parseInt(days))
      .lean();

    return res.status(200).json({ activity });
  } catch (error) {
    console.error("[getActivityStats]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
