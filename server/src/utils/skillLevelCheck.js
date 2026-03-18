import Notification from "../models/notification.model.js";
import { getIO } from "./socket.js";

// Determine rank based on sessions, hours, and reputation
export function calculateSkillLevel(user) {
  const { totalHoursTaught = 0, totalSessionsCompleted = 0, reputationScore = 0 } = user;
  
  let newLevel = "Code Spark"; 

  // Basic interaction
  if (totalSessionsCompleted >= 1) newLevel = "Skill Seeker";
  
  // Consistent teaching & learning
  if (totalSessionsCompleted >= 3 && totalHoursTaught >= 2 && reputationScore >= 3.5) {
    newLevel = "Code Crafter";
  }
  
  // Intermediate contributor
  if (totalSessionsCompleted >= 10 && totalHoursTaught >= 8 && reputationScore >= 4.0) {
    newLevel = "Project Alchemist";
  }
  
  // Advanced guide
  if (totalSessionsCompleted >= 25 && totalHoursTaught >= 20 && reputationScore >= 4.5) {
    newLevel = "Tech Pathfinder";
  }
  
  // Elite
  if (totalSessionsCompleted >= 50 && totalHoursTaught >= 40 && reputationScore >= 4.8) {
    newLevel = "System Architect";
  }
  
  // Highest Rank
  if (totalSessionsCompleted >= 100 && totalHoursTaught >= 100 && reputationScore >= 4.9) {
    newLevel = "Code Legend";
  }
  
  return newLevel;
}

// Helper to check, update, and notify level-ups
export async function checkAndApplyLevelUp(userDoc) {
  const newLevel = calculateSkillLevel(userDoc);
  
  if (userDoc.skillLevel !== newLevel) { // Level Up!
    const oldLevel = userDoc.skillLevel;
    userDoc.skillLevel = newLevel;
    
    // Notify the user
    try {
      const notif = await Notification.create({
        recipient: userDoc._id,
        type: "LEVEL_UP",
        message: `Congratulations! You've ranked up from ${oldLevel} to ${newLevel}!`,
        data: { newLevel },
      });
      getIO().to(`user:${userDoc._id.toString()}`).emit("notification:new", notif);
      getIO().to(`user:${userDoc._id.toString()}`).emit("user-updated", { skillLevel: newLevel });
    } catch (err) {
      console.error("[LevelUp Notification Error]", err.message);
    }
  }
}
