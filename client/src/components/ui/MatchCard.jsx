import { Link } from "react-router-dom";

const MatchCard = ({ match, variant = "partner", compact = false }) => {
  const isMentor = variant === "mentor";

  return (
    <div className={`group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] ${compact ? 'p-5 gap-4' : 'p-6 lg:p-8 gap-6'} hover:bg-white/[0.05] hover:border-[#4F86C6]/30 transition-all duration-500 flex flex-col shadow-2xl overflow-hidden`}>
      {/* GLOW DECORATION */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F86C6]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#4F86C6]/10 transition-colors" />

      {/* HEADER: USER INFO & MATCH SCORE / REPUTATION */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`${compact ? 'w-12 h-12 text-lg' : 'w-14 h-14 text-xl'} rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 flex items-center justify-center font-black text-white uppercase shadow-inner group-hover:scale-105 transition-transform duration-500`}>
              {match.name?.charAt(0)}
            </div>
            {!isMentor && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#0A0A0A] shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              to={`/user/${match._id}`}
              className={`block ${compact ? 'text-base' : 'text-lg'} font-black text-white tracking-tight group-hover:text-[#4F86C6] transition-colors truncate`}
            >
              {match.name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              {!isMentor && (
                match.reputationScore > 0 ? (
                  <div className="flex items-center gap-1 bg-[#FF7849]/10 border border-[#FF7849]/20 px-2 py-0.5 rounded-full">
                    <span className="text-[10px] text-[#FF7849] font-black italic">★ {match.reputationScore}</span>
                    <span className="text-[8px] text-[#FF7849]/60 font-medium uppercase tracking-tighter">({match.totalReviews})</span>
                  </div>
                ) : (
                  <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest italic tracking-tighter">New Node</span>
                )
              )}
              {isMentor && (
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest italic tracking-tighter">{match.email}</span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          {isMentor ? (
            <div className="flex flex-col items-end">
              <div className={`flex items-center gap-1.5 bg-[#FF7849]/10 border border-[#FF7849]/20 ${compact ? 'px-3 py-1.5 rounded-xl' : 'px-4 py-2 rounded-2xl'} shadow-[0_0_20px_rgba(255,120,73,0.1)]`}>
                <span className={`${compact ? 'text-lg' : 'text-2xl'} text-[#FF7849] font-black italic`}>★ {match.reputationScore || "0"}</span>
              </div>
              <p className={`text-[7px] text-gray-500 font-black uppercase tracking-[0.2em] ${compact ? 'mt-1.5' : 'mt-2'} opacity-60`}>
                {match.totalReviews || "0"} Peer Reviews
              </p>
            </div>
          ) : (
            <div className="relative inline-block">
              <p className={`${compact ? 'text-2xl' : 'text-3xl'} font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                {match.compatibilityScore}<span className="text-sm text-[#4F86C6] ml-0.5">%</span>
              </p>
              <div className="h-0.5 w-full bg-[#4F86C6]/30 mt-1 rounded-full overflow-hidden">
                <div className="h-full bg-[#4F86C6]" style={{ width: `${match.compatibilityScore}%` }} />
              </div>
              <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Match Coeff</p>
            </div>
          )}
        </div>
      </div>

      {/* BIO SHARD */}
      {match.bio && (
        <div className="relative z-10">
          <p className={`${compact ? 'text-[11px] leading-normal' : 'text-xs leading-relaxed'} text-gray-400 font-medium italic border-l-2 border-white/5 pl-4 line-clamp-2 selection:bg-[#4F86C6]/20 font-mono tracking-tighter`}>
            "{match.bio}"
          </p>
        </div>
      )}

      {/* SKILL REGISTRY */}
      <div className={`grid grid-cols-1 ${isMentor ? "" : "sm:grid-cols-2"} ${compact ? 'gap-3' : 'gap-4'} relative z-10 mt-auto`}>
        {/* OUTPUT: TEACHES */}
        <div className={compact ? 'space-y-2' : 'space-y-3'}>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-[#FF7849] rounded-full animate-pulse" />
            <p className="text-[8px] text-[#FF7849] font-black uppercase tracking-[0.2em]">Output_Stack</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {match.teachingSkills?.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className={`${compact ? 'text-[9px] px-2.5 py-1' : 'text-[10px] px-3 py-1.5'} bg-black/40 border border-white/10 text-gray-300 rounded-xl font-bold group-hover:border-[#FF7849]/30 transition-colors uppercase tracking-tight`}
              >
                {s.skillName}
              </span>
            ))}
            {match.teachingSkills?.length > 3 && (
              <span className="text-[9px] text-gray-600 font-bold flex items-center px-1">+{match.teachingSkills.length - 3}</span>
            )}
          </div>
        </div>

        {/* INPUT: LEARNS - Hidden in Mentor View */}
        {!isMentor && (
          <div className={compact ? 'space-y-2' : 'space-y-3'}>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-[#4F86C6] rounded-full" />
              <p className="text-[8px] text-[#4F86C6] font-black uppercase tracking-[0.2em]">Input_Goals</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {match.learningSkills?.slice(0, 2).map((s, i) => (
                <span
                  key={i}
                  className={`${compact ? 'text-[9px] px-2.5 py-1' : 'text-[10px] px-3 py-1.5'} bg-black/40 border border-white/10 text-gray-300 rounded-xl font-bold group-hover:border-[#4F86C6]/30 transition-colors uppercase tracking-tight`}
                >
                  {s.skillName}
                </span>
              ))}
              {match.learningSkills?.length > 2 && (
                <span className="text-[9px] text-gray-600 font-bold flex items-center px-1">+{match.learningSkills.length - 2}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ACTION BUFFER */}
      <div className={`grid grid-cols-2 ${compact ? 'gap-2 pt-2' : 'gap-3 pt-4'} relative z-10`}>
        <Link
          to={`/user/${match._id}`}
          className={`${compact ? 'py-2.5' : 'py-3.5'} bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]`}
        >
          Profile
        </Link>
        <Link
          to={`/user/${match._id}`}
          className={`${compact ? 'py-2.5' : 'py-3.5'} bg-white text-black rounded-2xl text-[9px] font-black uppercase tracking-widest text-center hover:bg-gray-200 transition-all shadow-[0_10px_15px_-5px_rgba(255,255,255,0.1)] active:scale-[0.98]`}
        >
          {compact ? 'Book' : 'Book Session'}
        </Link>
      </div>
    </div>
  );
};


export default MatchCard;
