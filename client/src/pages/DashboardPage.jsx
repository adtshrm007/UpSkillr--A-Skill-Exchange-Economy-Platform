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

              {/* SKILLS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-white/2 border border-white/5 p-8 rounded-3xl hover:bg-white/4 transition-colors">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF7849] mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#FF7849] rounded-full animate-pulse" />{" "}
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {(teachingSkills || []).length === 0 ? (
                      <Link
                        to="/profile"
                        className="text-xs text-gray-600 italic hover:text-white transition-colors"
                      >
                        Add tech skills on your profile →
                      </Link>
                    ) : (
                      teachingSkills.map((s, i) => (
                        <div
                          key={i}
                          className="bg-black/40 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3"
                        >
                          <span className="text-xs font-bold">
                            {s.skillName}
                          </span>
                          <span className="text-[8px] bg-[#FF7849]/10 text-[#FF7849] px-2 py-0.5 rounded uppercase font-black">
                            {s.skillLevel}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="bg-white/2 border border-white/5 p-8 rounded-3xl hover:bg-white/4 transition-colors">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F86C6] mb-6 flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#4F86C6] rounded-full" />{" "}
                    Learning Goals
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {(learningSkills || []).length === 0 ? (
                      <Link
                        to="/profile"
                        className="text-xs text-gray-600 italic hover:text-white transition-colors"
                      >
                        Add learning goals →
                      </Link>
                    ) : (
                      learningSkills.map((s, i) => (
                        <div
                          key={i}
                          className="bg-black/40 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-gray-300"
                        >
                          {s.skillName}
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              {/* UPCOMING SESSIONS */}
              <section className="bg-gradient-to-br from-black to-white/5 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7849]/10 blur-[50px] rounded-full pointer-events-none"></div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h3 className="text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Live & Upcoming
                  </h3>
                  <Link
                    to="/sessions"
                    className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-tighter"
                  >
                    View All →
                  </Link>
                </div>
                {loadingSessions ? (
                  <div className="flex gap-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-24 bg-white/3 rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 text-xs italic">
                      No learning sessions scheduled yet.
                    </p>
                    <Link
                      to="/explore"
                      className="text-[#4F86C6] text-xs font-bold hover:underline mt-2 block"
                    >
                      Find an engineering mentor →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessions.map((s) => (
                      <div
                        key={s._id}
                        className="group bg-[#161616] p-5 rounded-2xl border border-white/5 hover:border-[#4F86C6]/50 transition-colors shadow-xl"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-black text-white group-hover:text-[#4F86C6] transition-colors">
                            {s.requestedSkill} Session
                            {s.offeredSkill && <span className="block text-[8px] text-green-400 mt-1 uppercase tracking-widest">Swap: {s.offeredSkill}</span>}
                          </h4>
                          <span className="text-[9px] font-black text-[#4F86C6] bg-[#4F86C6]/10 px-2 py-0.5 rounded uppercase">
                            {s.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold font-mono">
                          {new Date(s.scheduledAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="flex justify-between items-end mt-4">
                          <div>
                            <p className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase font-bold">
                              {s.durationHrs} hr <span className="mx-1">•</span> {s.creditCost} credits
                            </p>
                          </div>
                          {s.status === "Confirmed" && (
                            <Link to={`/room/${s._id}`} className="bg-green-500 text-black px-5 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] active:scale-95">
                              Join
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-4 space-y-6">
              {/* ACTIVITY CHART */}
              <section className="bg-[#121212] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">
                    Activity ({chartFilter === "week" ? "This Week" : "This Month"})
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartFilter("week")}
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-colors ${
                        chartFilter === "week"
                          ? "bg-[#FF7849] text-black"
                          : "bg-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setChartFilter("month")}
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-colors ${
                        chartFilter === "month"
                          ? "bg-[#4F86C6] text-black"
                          : "bg-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      Month
                    </button>
                  </div>
                </div>
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111",
                          border: "1px solid #333",
                          borderRadius: "12px",
                        }}
                        itemStyle={{ fontSize: "10px" }}
                        formatter={(value) => `${value.toFixed(1)}h`}
                      />
                      <Legend 
                        verticalAlign="top" 
                        align="right" 
                        iconType="circle"
                        wrapperStyle={{ fontSize: '9px', paddingBottom: '20px', textTransform: 'uppercase', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="platform" name="Platform Time" fill="#999" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="session" name="Session Time" fill="#FF7849" radius={[4, 4, 0, 0]} />

                      
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#444",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      />
                    </BarChart>

                  </ResponsiveContainer>
                </div>
              </section>

              {/* RECOMMENDED FOR YOU */}
              <section className="bg-white/2 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4F86C6]/10 blur-[40px] rounded-full pointer-events-none"></div>
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4F86C6]">
                    Recommended For You
                  </h4>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_green]" />
                </div>
                
                {/* Tech Trending Tag */}
                <div className="mb-6 bg-white/5 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                   <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">🔥 Trending Tech</p>
                   <p className="text-[10px] font-black text-white">Full Stack Web</p>
                </div>

                <div className="space-y-4 relative z-10">
                  {loadingMatches ? (
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 bg-white/3 rounded-2xl animate-pulse"
                      />
                    ))
                  ) : matches.length === 0 ? (
                    <p className="text-gray-600 text-xs italic text-center py-4">
                      Add tech skills to find matches.
                    </p>
                  ) : (
                    <>
                      <p className="text-[9px] uppercase font-black tracking-widest text-gray-500 mb-2">Suggested Mentors</p>
                      {matches.slice(0, 2).map((m, i) => (
                        <div
                          key={m._id || i}
                          className="p-4 rounded-2xl bg-white/3 border border-transparent hover:border-white/10 transition-all cursor-pointer group mb-2"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#4F86C6]/20 rounded-full flex items-center justify-center text-[#4F86C6] font-black text-xs uppercase shadow-[0_0_15px_rgba(79,134,198,0.2)]">
                              {m.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black group-hover:text-[#4F86C6] transition-colors truncate">
                                {m.name}
                              </p>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                {m.teachingSkills?.slice(0, 2).map((sk, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[7px] font-black text-gray-400 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded"
                                  >
                                    {sk.skillName}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-green-400">
                              {m.compatibilityScore}%
                            </span>
                          </div>
                        </div>
                      ))}
                      {matches.length > 2 && (
                        <>
                          <p className="text-[9px] uppercase font-black tracking-widest text-gray-500 mt-4 mb-2">Suggested Swaps</p>
                          {matches.slice(2).map((m, i) => (
                            <div
                              key={m._id || i}
                              className="p-4 rounded-2xl bg-white/3 border border-transparent hover:border-[#FF7849]/30 transition-all cursor-pointer group mb-2"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#FF7849]/20 rounded-full flex items-center justify-center text-[#FF7849] font-black text-xs uppercase shadow-[0_0_15px_rgba(255,120,73,0.2)]">
                                  {m.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-black group-hover:text-[#FF7849] transition-colors truncate">
                                    {m.name}
                                  </p>
                                  <div className="flex gap-2 mt-1 flex-wrap">
                                    {m.learningSkills?.slice(0, 2).map((sk, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[7px] font-black text-gray-400 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded"
                                      >
                                        Learns {sk.skillName}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </div>
                <button
                  onClick={() => navigate("/explore")}
                  className="w-full mt-6 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-gray-200 transition-all shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)] relative z-10"
                >
                  Explore Tech Community
                </button>
              </section>

              {/* NETWORK / COMMUNITY */}
              <section className="bg-gradient-to-tr from-[#161616] to-[#0F0F0F] border border-white/5 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Network & Community</h4>
                  <div className="px-2 py-1 bg-green-500/20 rounded text-green-500 text-[8px] font-black uppercase tracking-widest">
                    1.2k Active Now
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-[9px] uppercase font-black tracking-widest text-gray-500 mb-2">Joined Communities</p>
                  
                  <div className="group bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF7849]/20 flex items-center justify-center text-lg">⚡</div>
                      <div>
                        <p className="text-xs font-black text-white">Frontend Masters Cohort</p>
                        <p className="text-[9px] font-mono text-gray-500">Live in 2 hrs</p>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#4F86C6]/20 flex items-center justify-center text-lg">⚙️</div>
                      <div>
                        <p className="text-xs font-black text-white">System Design Discussions</p>
                        <p className="text-[9px] font-mono text-gray-500">45 new messages</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  to="/communities"
                  className="block w-full text-center py-3 border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all"
                >
                  Explore Communities
                </Link>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}