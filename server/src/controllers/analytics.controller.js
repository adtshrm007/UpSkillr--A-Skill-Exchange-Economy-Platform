import Analytics from "../models/analytics.model.js";

// POST /analytics/ping
export const pingPlatformActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split("T")[0];

    await Analytics.findOneAndUpdate(
      { userId, date: today },
      { $inc: { platformMinutes: 1 } },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Platform activity logged" });
  } catch (error) {
    console.error("[pingPlatformActivity]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /analytics/weekly
export const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = [];
    
    // Generate dates for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        platformHours: 0,
        sessionHours: 0
      });
    }

    const startDate = result[0].date;
    const endDate = result[6].date;

    const data = await Analytics.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).lean();

    // Map data to the result array
    data.forEach(item => {
      const entry = result.find(r => r.date === item.date);
      if (entry) {
        entry.platformHours = Math.round((item.platformMinutes / 60) * 10) / 10;
        entry.sessionHours = Math.round((item.sessionMinutes / 60) * 10) / 10;
      }
    });

    return res.status(200).json({ analytics: result });
  } catch (error) {
    console.error("[getWeeklyAnalytics]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
