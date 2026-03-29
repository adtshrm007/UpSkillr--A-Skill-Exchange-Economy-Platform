import React from "react";

const UserMatchCard = ({ user, matchPercent = 85 }) => {
  return (
    <div className="bg-[#161616] border border-white/10 rounded-4xl p-6 hover:border-[#4F86C6]/50 transition-all duration-300 group shadow-xl">
      {/* Header: Photo & Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border border-white/10"
          />
          <div className="absolute -bottom-2 -right-2 bg-[#4F86C6] text-[10px] px-2 py-1 rounded-lg font-bold text-white uppercase tracking-tighter">
            {user.skillLevel}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-[#4F86C6] transition-colors">
            {user.name}
          </h3>
          <p className="text-xs text-gray-500 font-mono">{user.email}</p>
        </div>
      </div>

      {/* Bio Section */}
      <p className="text-sm text-gray-400 mb-6 line-clamp-2 italic">
        "{user.bio}"
      </p>

      {/* Skills Sections */}
      <div className="space-y-4 mb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            Teaches
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.teachingSkills.map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#FF7849]/10 text-[#FF7849] text-xs rounded-full border border-[#FF7849]/20"
              >
                {s.skillName || "Skill"}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            Learning
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.learningSkills.map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#4F86C6]/10 text-[#4F86C6] text-xs rounded-full border border-[#4F86C6]/20"
              >
                {s.skillName || "Skill"}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Reputation & Match Score */}
      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase">Reputation</p>
          <p className="font-bold text-white">{user.reputationScore}</p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="text-xs text-gray-500">MATCH</span>
            <span className="text-lg font-black text-[#4F86C6]">
              {matchPercent}%
            </span>
          </div>
          <div className="w-24 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-[#4F86C6] transition-all duration-1000"
              style={{ width: `${matchPercent}%` }}
            />
          </div>
        </div>
      </div>

      <button className="w-full mt-6 py-3 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#4F86C6] hover:text-white transition-all transform active:scale-95">
        Connect Now
      </button>
    </div>
  );
};

export default UserMatchCard;
