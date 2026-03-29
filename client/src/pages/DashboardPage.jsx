import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import { useAuth } from "../context/Auth.context.jsx";
import { sessionService } from "../services/session.service.js";
import { matchesService } from "../services/matches.service.js";
import { analyticsService } from "../services/analytics.service.js";


import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";


export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [name, setName] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [skillCredits, setSkillCredits] = useState("");
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [chartFilter, setChartFilter] = useState("week");
  const [analyticsData, setAnalyticsData] = useState([]);



  useEffect(() => {
    sessionService
      .getMy({ limit: 4, status: "Confirmed" })
      .then((r) => setSessions(r.data.sessions || []))
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));

    matchesService
      .find({ limit: 3 })
      .then((r) => setMatches(r.data.matches || []))
      .catch(() => setMatches([]))
      .finally(() => setLoadingMatches(false));

    sessionService
      .getMy({ limit: 100, status: "Completed" })
      .then((r) => setCompletedSessions(r.data.sessions || []))
      .catch(() => setCompletedSessions([]));

    analyticsService
      .getWeekly()
      .then((r) => setAnalyticsData(r.data.analytics || []))
      .catch(() => setAnalyticsData([]));
  }, []);



  const chartData = useMemo(() => {
    return analyticsData.map(item => {
      const d = new Date(item.date);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: dayName,
        platform: item.platformHours,
        session: item.sessionHours
      };
    });
  }, [analyticsData]);


  useEffect(() => {
    if (user) {
      setName(user.name);
      setSkillCredits(user.skillCredits);
      setSkillLevel(user.skillLevel);
      setTeachingSkills(user.teachingSkills);
      setLearningSkills(user.learningSkills);
    }
  }, [user]);

  const randomNextStep = useMemo(() => {
    const steps = [
      "Continue your ongoing session",
      "You have pending swap requests",
      "Recommended skill to explore next",
      "Suggested mentor based on your goals"
    ];
    // deterministically pseudorandom using email length or something static so it doesn't flicker on re-renders,
    // actually Math.random() in useMemo is stable within session.
    return steps[Math.floor(Math.random() * steps.length)];
  }, []);

  return (
    <div className="bg-[#080808] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-200 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-4 lg:p-10 lg:pl-32 xl:pl-40">
        <div className="max-w-full mx-auto space-y-10">
          {/* GREETING HEADER & PROGRESS */}
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 animate-in fade-in slide-in-from-top duration-700">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#FF7849] font-black mb-1">
                Developer Environment: Active
              </p>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter italic mb-6">
                HELLO, <span className="text-white uppercase">{name}</span>
              </h2>
              {/* STRONG CTAS */}
              <div className="flex flex-wrap gap-3">
                <Link to="/explore" className="bg-white text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#FF7849] hover:text-black transition-all">
                  Start Skill Swap
                </Link>
                <Link to="/explore" className="bg-[#4F86C6]/20 text-[#4F86C6] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#4F86C6] hover:text-white transition-all">
                  Find a Mentor
                </Link>
                <button className="bg-white/5 text-gray-300 border border-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Continue Learning
                </button>
                <Link to="/explore" className="bg-white/5 text-gray-300 border border-white/10 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Explore Communities
                </Link>
              </div>
            </div>

            {/* UPGRADED PROGRESS SECTION */}
            <div className="lg:w-1/3 bg-[#111] border border-white/10 p-5 rounded-2xl flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                    Current Rank
                  </p>
                  <p className="text-lg font-black text-[#4F86C6]">Code Spark</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#FF7849] uppercase">Next: Code Legend</p>
                  <p className="text-xs text-white font-bold">{user?.totalHoursTaught || 0} / 50 XP</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#4F86C6] to-[#FF7849]" 
                  style={{ width: `${Math.min(((user?.totalHoursTaught || 0) / 50) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest text-right mt-1">
                {50 - (user?.totalHoursTaught || 0)} XP to next level
              </p>
            </div>
          </header>

          {/* NEXT STEP IN TECH SECTION */}
          <section className="bg-gradient-to-r from-[#FF7849]/10 via-[#111] to-[#4F86C6]/10 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FF7849]/20 flex items-center justify-center">
                <span className="text-xl animate-bounce">⚡</span>
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Your Next Step</h3>
                <p className="text-xs text-gray-400 font-medium font-mono">{randomNextStep}</p>
              </div>
            </div>
            <button className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg whitespace-nowrap">
              Continue Learning →
            </button>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-8 space-y-6">
              {/* STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white/3 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <h3 className="text-6xl font-black tracking-tighter">
                        {user?.totalHoursTaught || 0}{" "}
                        <span className="text-[#4F86C6] text-2xl">hrs</span>
                      </h3>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mt-2">
                        Hours Taught
                      </p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-5xl font-black tracking-tighter text-white">
                        {user?.totalSessionsCompleted || 0}
                      </h3>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mt-2">
                        Sessions Completed
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#4F86C6]/10 blur-[80px] rounded-full pointer-events-none" />
                </div>

                <div
                  className="bg-[#FF7849] rounded-3xl p-8 flex flex-col justify-between text-black group hover:rotate-1 transition-transform cursor-pointer"
                  onClick={() => navigate("/credits")}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <span className="font-black text-2xl tracking-tighter">
                      {skillCredits} xp
                    </span>
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-tight leading-tight">
                    Skill
                    <br />
                    Credits:
                  </p>
                </div>
              </div>

            {/* TILE 5: TECH STACK & GOALS */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#FF7849]/5 blur-[40px] rounded-full pointer-events-none" />
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FF7849] mb-4 flex items-center gap-2 relative z-10">
                  <span className="w-1.5 h-1.5 bg-[#FF7849] rounded-full" /> TECH STACK
                </h4>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {(teachingSkills || []).length === 0 ? (
                    <Link to="/profile" className="text-[10px] text-gray-600 italic hover:text-white transition-colors">Add skills →</Link>
                  ) : (
                    teachingSkills.map((s, i) => (
                      <div key={i} className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2 group/skill hover:border-[#FF7849]/30 transition-all">
                        <span className="text-[10px] font-bold">{s.skillName}</span>
                        <span className="text-[7px] bg-[#FF7849]/10 text-[#FF7849] px-1.5 py-0.5 rounded uppercase font-black">{s.skillLevel}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-24 h-24 bg-[#4F86C6]/5 blur-[40px] rounded-full pointer-events-none" />
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#4F86C6] mb-4 flex items-center gap-2 relative z-10">
                  <span className="w-1.5 h-1.5 bg-[#4F86C6] rounded-full" /> LEARNING GOALS
                </h4>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {(learningSkills || []).length === 0 ? (
                    <Link to="/profile" className="text-[10px] text-gray-600 italic hover:text-white transition-colors">Add goals →</Link>
                  ) : (
                    learningSkills.map((s, i) => (
                      <div key={i} className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-300 hover:border-[#4F86C6]/30 transition-all">
                        {s.skillName}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* TILE 6: LIVE & UPCOMING SESSIONS */}
            <div className="lg:col-span-4 bg-gradient-to-b from-[#161616] to-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full pointer-events-none" />
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-[9px] font-black uppercase tracking-widest italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Live & Upcoming
                </h3>
                <Link to="/sessions" className="text-[9px] text-gray-500 hover:text-white uppercase font-bold tracking-tighter">View All →</Link>
              </div>

              <div className="flex-1 space-y-3 relative z-10">
                {loadingSessions ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => <div key={i} className="h-20 bg-white/3 rounded-2xl animate-pulse" />)}
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-gray-600 text-[10px] italic">No active sessions.</p>
                    <Link to="/explore" className="text-[#4F86C6] text-[10px] font-bold hover:underline mt-1 block">Find mentor →</Link>
                  </div>
                ) : (
                  sessions.map((s) => (
                    <div key={s._id} className="group/session bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-[#4F86C6]/50 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[11px] font-black text-white group-hover/session:text-[#4F86C6] transition-colors">{s.requestedSkill}</h4>
                        <span className="text-[8px] font-black text-[#4F86C6] bg-[#4F86C6]/10 px-1.5 py-0.5 rounded uppercase">{s.status}</span>
                      </div>
                      <p className="text-[9px] text-gray-500 font-mono mb-3 uppercase tabular-nums">
                         {new Date(s.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {s.status === "Confirmed" && (
                        <Link to={`/room/${s._id}`} className="block w-full text-center bg-green-500 text-black py-2 rounded-xl text-[9px] font-black uppercase hover:bg-green-400 transition-all shadow-[0_5px_15px_-5px_rgba(34,197,94,0.3)]">
                          Join Session
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TILE 7: NETWORK & GROWTH HUB */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recommendations */}
              <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4F86C6]">Recommended for you</h4>
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {loadingMatches ? (
                    [1, 2].map((i) => <div key={i} className="h-20 bg-white/3 rounded-2xl animate-pulse" />)
                  ) : matches.length === 0 ? (
                    <p className="text-gray-600 text-[10px] italic py-2">Add goals to find matches.</p>
                  ) : (
                    matches.slice(0, 4).map((m, i) => (
                      <div key={m._id || i} className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#4F86C6]/30 transition-all cursor-pointer group/match">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#4F86C6]/20 rounded-lg flex items-center justify-center text-[#4F86C6] font-black text-[10px] uppercase">{m.name?.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black group-hover/match:text-[#4F86C6] transition-colors truncate">{m.name}</p>
                            <p className="text-[8px] text-gray-500 uppercase tracking-widest truncate">{m.teachingSkills?.[0]?.skillName || "Expert"}</p>
                          </div>
                          <span className="text-[9px] font-black text-green-400 tabular-nums">{m.compatibilityScore}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Network */}
              <div className="bg-gradient-to-br from-[#161616] to-black border border-white/5 rounded-[2.5rem] p-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white">TECH NETWORK</h4>
                  <span className="text-[8px] font-black text-green-500 uppercase">1.2k Active</span>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#FF7849]/20 flex items-center justify-center text-sm">⚡</div>
                      <div>
                        <p className="text-[10px] font-black text-white">Frontend Cohort</p>
                        <p className="text-[8px] text-gray-500 uppercase">Live in 2h</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#4F86C6]/20 flex items-center justify-center text-sm">⚙️</div>
                      <div>
                        <p className="text-[10px] font-black text-white">Sys-Design Hub</p>
                        <p className="text-[8px] text-gray-500 uppercase">45 Active</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Link to="/communities" className="block w-full text-center py-3 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all">Explore Network</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
          </div>
        </div>
      </main>
    </div>
  );
}