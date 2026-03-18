import userModel from "../models/user.model.js";

export const findMatches = async (req, res) => {
  try {
    const { page = 1, limit = 12, skill } = req.query;
    const user = await userModel.findById(req.user._id);

    if (!user)
      return res.status(401).json({ message: "User not found. Please log in again." });

    const myTeaching = user.teachingSkills.map((s) => s.skillName.toLowerCase());
    const myLearning = user.learningSkills.map((s) => s.skillName.toLowerCase());

    if (!myTeaching.length && !myLearning.length)
      return res.status(200).json({ matches: [], total: 0, message: "Add skills to your profile to find matches" });

    // Build match query
    const query = {
      _id: { $ne: user._id },
      isActive: true,
    };

    if (skill) {
      query.$or = [
        { "teachingSkills.skillName": new RegExp(skill, "i") },
        { "learningSkills.skillName": new RegExp(skill, "i") },
      ];
    } else if (myLearning.length || myTeaching.length) {
      query.$or = [
        { "teachingSkills.skillName": { $in: myLearning.map((s) => new RegExp(s, "i")) } },
        { "learningSkills.skillName": { $in: myTeaching.map((s) => new RegExp(s, "i")) } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const candidates = await userModel
      .find(query)
      .select("name email bio profilePhoto teachingSkills learningSkills reputationScore totalReviews skillCredits availability")
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Compute compatibility score
    const scored = candidates.map((c) => {
      const theirTeaching = c.teachingSkills.map((s) => s.skillName.toLowerCase());
      const theirLearning = c.learningSkills.map((s) => s.skillName.toLowerCase());

      const canTeachMe = theirTeaching.filter((s) => myLearning.includes(s)).length;
      const iCanTeach = myTeaching.filter((s) => theirLearning.includes(s)).length;
      const total = myLearning.length + myTeaching.length;

      const hasAvailability = c.availability && c.availability.some(a => a.status === "Available");
      const baseCompat = total > 0 ? Math.round(((canTeachMe + iCanTeach) / (total * 2)) * 100) : 0;
      
      let enhancedScore = baseCompat;
      if (baseCompat > 0) {
        const repBonus = (c.reputationScore || 0) * 2; // max +10
        const availBonus = hasAvailability ? 10 : 0; // max +10
        enhancedScore = Math.min(100, baseCompat + repBonus + availBonus);
      }

      return { ...c, compatibilityScore: enhancedScore };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore || b.reputationScore - a.reputationScore);

    const total = await userModel.countDocuments(query);

    return res.status(200).json({
      matches: scored,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[findMatches]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
