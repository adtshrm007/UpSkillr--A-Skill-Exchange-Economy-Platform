import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import { useAuth } from "../context/Auth.context.jsx";
import { sessionService } from "../services/session.service.js";
import { matchesService } from "../services/matches.service.js";
import { mentorsService } from "../services/mentors.service.js";
import { analyticsService } from "../services/analytics.service.js";
import MatchCard from "../components/ui/MatchCard";

import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [topMentors, setTopMentors] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingMentors, setLoadingMentors] = useState(true);
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
      .find({ limit: 4 })
      .then((r) => setMatches(r.data.matches || []))
      .catch(() => setMatches([]))
      .finally(() => setLoadingMatches(false));

    mentorsService
      .find({ limit: 2 })
      .then((r) => setTopMentors(r.data.matches || []))
      .catch(() => setTopMentors([]))
      .finally(() => setLoadingMentors(false));

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
      "Initialize your next skill relay",
      "Sync pending collaboration requests",
      "Upgrade your core tech stack",
      "Connect with prioritized mentors"
    ];
    return steps[Math.floor(Math.random() * steps.length)];
  }, []);

  return (
    <div className="bg-[#080808] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-200 overflow-x-hidden selection:bg-[#FF7849]/30">
      <NavBar />
      <main className="flex-1 p-4 lg:p-10 lg:pl-32 xl:pl-44 overflow-y-auto overflow-x-hidden">
        <div className="max-w-full mx-auto space-y-12 pb-10">
          
          {/* HEADER SECTION: GREETING & PROGRESS */}
          <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 animate-in fade-in slide-in-from-top duration-1000">
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-[#FF7849] font-black mb-3 px-1 animate-pulse">
                  ENVIRONMENT: LIVE // USER: {name?.split(' ')[0] || 'NODE'}
                </p>
                <div className="relative inline-block">
                  <h2 className="text-5xl lg:text-7xl font-black tracking-tighter italic uppercase leading-none">
                    SYNC <span className="text-white">DASH</span>
                  </h2>
                  <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#FF7849]" />
                </div>
              </div>

              {/* STRATEGY LAYER: UNIFIED ACTION BAR */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/explore" className="group relative px-6 py-3.5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF7849] transition-all shadow-[0_15px_30px_-5px_rgba(255,120,73,0.3)] active:scale-95">
                  Initialize Swap
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7849] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF7849]"></span>
                  </span>
                </Link>
                <Link to="/mentors" className="px-6 py-3.5 bg-[#4F86C6]/10 border border-[#4F86C6]/30 text-[#4F86C6] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#4F86C6] hover:text-white transition-all active:scale-95">
                  Mentor Hub
                </Link>
                <Link to="/sessions" className="px-6 py-3.5 bg-white/5 border border-white/10 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95">
                  Active Log
                </Link>
                <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
                <button className="text-[10px] text-gray-600 font-black uppercase tracking-widest hover:text-[#FF7849] transition-colors underline underline-offset-8 decoration-white/10">
                  Global Repositories
                </button>
              </div>
            </div>

            {/* UPGRADED PROGRESS SECTION (BENTO TILE) */}
            <div className="xl:w-[400px] group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl hover:border-[#4F86C6]/30 transition-all duration-500 overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4F86C6]/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#4F86C6]/20 transition-colors" />
               <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">NODE_AUTHORITY</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter drop-shadow-[0_0_10px_rgba(79,134,198,0.3)]">CODE SPARK</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                    <span className="text-[10px] font-black text-[#FF7849]">RANK #42</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-[#4F86C6] uppercase tracking-widest">Next Priority: Level_02</p>
                   <p className="text-xs text-white font-black tracking-tighter">{user?.totalHoursTaught || 0} <span className="text-gray-600">/ 50 XP</span></p>
                </div>
                <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4F86C6] via-[#6a9fd4] to-[#FF7849] rounded-full shadow-[0_0_15px_rgba(79,134,198,0.5)] transition-all duration-1000" 
                    style={{ width: `${Math.min(((user?.totalHoursTaught || 0) / 50) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:30px_30px] animate-pulse" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-600 italic">
                   <span>INITIATED</span>
                   <span>LEGACY_TARGET</span>
                </div>
              </div>
            </div>
          </header>

          {/* SYSTEM ALERT: DYNAMIC NOTIFICATION */}
          <section className="relative group overflow-hidden bg-gradient-to-r from-[#FF7849]/10 via-[#111] to-transparent border border-white/5 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#FF7849]/30 transition-all duration-500">
             <div className="absolute top-0 left-0 w-1 h-full bg-[#FF7849]" />
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#FF7849]/10 flex items-center justify-center border border-[#FF7849]/20 shadow-inner">
                   <span className="text-2xl animate-bounce text-[#FF7849]">⚡</span>
                </div>
                <div>
                   <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-1.5 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-[#FF7849] rounded-full animate-ping" />
                     Action Required
                   </h3>
                   <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                     {randomNextStep} <span className="text-white/20 px-2">//</span> Optimization Node: <span className="text-white underline decoration-[#FF7849]">Standard</span>
                   </p>
                </div>
             </div>
             <button className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF7849] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)]">
                Execute Process
             </button>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* MAIN COLUMN (8/12) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* STAT BENTO TILES */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 group relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden hover:bg-white/[0.04] transition-all">
                  <div className="relative z-10 flex justify-between items-center h-full">
                    <div>
                      <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.4em] mb-4">Total Skill Outflow</p>
                      <h3 className="text-6xl font-black tracking-tighter italic text-white leading-none">
                        {user?.totalHoursTaught || 0} 
                        <span className="text-lg text-[#4F86C6] ml-2 font-normal not-italic tracking-widest uppercase">hrs</span>
                      </h3>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] uppercase font-black text-gray-500 tracking-[0.4em] mb-4">Relays Verified</p>
                       <h3 className="text-5xl font-black tracking-tighter text-white/50 leading-none">
                        {user?.totalSessionsCompleted || 0}
                      </h3>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#4F86C6]/5 blur-[60px] rounded-full group-hover:bg-[#4F86C6]/10 transition-colors" />
                </div>

                <div 
                   onClick={() => navigate("/credits")}
                   className="group relative bg-[#FF7849] rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden cursor-pointer hover:rotate-1 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,120,73,0.3)]"
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="w-12 h-12 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                      <span className="text-xl">💎</span>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-black/50 uppercase tracking-widest mb-1">Available</p>
                       <span className="font-black text-4xl tracking-tighter text-black">{skillCredits}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60 relative z-10">Skill Credits_</p>
                  {/* Decorative mesh */}
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
                </div>
              </div>

              {/* SKILL REGISTRY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] hover:border-[#FF7849]/30 transition-all">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF7849] flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#FF7849] rounded-full animate-pulse" /> TEACH_STACK
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(teachingSkills || []).length === 0 ? (
                      <Link to="/profile" className="text-[10px] text-gray-600 font-bold uppercase tracking-widest border border-dashed border-white/10 px-4 py-2 rounded-xl hover:text-white transition-colors">INITIATE_MODULES +</Link>
                    ) : (
                      teachingSkills.map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl flex items-center gap-3 group/skill hover:bg-[#FF7849]/10 hover:border-[#FF7849]/30 transition-all">
                          <span className="text-[11px] font-black uppercase tracking-tight text-white/50 group-hover/skill:text-white">{s.skillName}</span>
                          <span className="text-[8px] bg-white/10 text-white/40 group-hover/skill:text-[#FF7849] px-2 py-0.5 rounded font-black tracking-tighter uppercase">{s.skillLevel}</span>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] hover:border-[#4F86C6]/30 transition-all">
                   <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4F86C6] flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#4F86C6] rounded-full" /> ACQUIRE_GOALS
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(learningSkills || []).length === 0 ? (
                      <Link to="/profile" className="text-[10px] text-gray-600 font-bold uppercase tracking-widest border border-dashed border-white/10 px-4 py-2 rounded-xl hover:text-white transition-colors">SET_TARGETS +</Link>
                    ) : (
                      learningSkills.map((s, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl text-[11px] font-black text-white/50 uppercase tracking-tight hover:bg-[#4F86C6]/10 hover:border-[#4F86C6]/30 hover:text-white transition-all">
                          {s.skillName}
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              {/* ACTIVE RELAYS (UPCOMING SESSIONS) */}
              <section className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F86C6]/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#4F86C6]/10 transition-colors" />
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" /> ACTIVE_RELAYS
                  </h3>
                  <Link to="/sessions" className="text-[9px] text-[#4F86C6] hover:text-white font-black uppercase tracking-widest transition-colors">SYST_LOG_VIEW →</Link>
                </div>

                {loadingSessions ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)}
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] italic">No active data relays located</p>
                    <Link to="/explore" className="text-[#4F86C6] text-[10px] font-black uppercase tracking-widest mt-4 inline-block hover:underline underline-offset-8">INITIATE_SEARCH_PROTOCOL</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sessions.map((s) => (
                      <div key={s._id} className="relative group/session bg-black/40 border border-white/10 p-6 rounded-3xl hover:border-[#4F86C6]/50 transition-all">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest group-hover/session:text-[#4F86C6] transition-colors">{s.requestedSkill} Relay</h4>
                            {s.offeredSkill && <p className="text-[8px] text-[#FF7849] mt-2 font-black uppercase tracking-[0.2em] italic">SYNC_PAIR: {s.offeredSkill}</p>}
                           </div>
                           <span className="text-[8px] font-black text-[#4F86C6] bg-[#4F86C6]/10 border border-[#4F86C6]/30 px-2 py-1 rounded uppercase tracking-tighter">{s.status}</span>
                        </div>
                        <div className="flex items-end justify-between">
                           <div>
                             <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">timestamp_utc</p>
                             <p className="text-xs font-black text-white italic">
                               {new Date(s.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                             </p>
                           </div>
                           {s.status === "Confirmed" && (
                             <Link to={`/room/${s._id}`} className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all shadow-[0_0_20px_rgba(34,197,94,0.1)]">SYNC_NOW</Link>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* TOP AUTHORITY MENTORS */}
              <section className="bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-48 h-48 bg-[#FF7849]/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#FF7849]/10 transition-colors" />
                 
                 <div className="flex justify-between items-center mb-10 relative z-10">
                    <div>
                       <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FF7849] flex items-center gap-3">
                         <span className="w-2 h-2 rounded-full bg-[#FF7849] animate-pulse" /> AUTHORITY_NODES
                       </h3>
                    </div>
                    <Link to="/mentors" className="text-[9px] text-gray-500 hover:text-white font-black uppercase tracking-widest transition-colors">GLOBAL_INDEX →</Link>
                 </div>

                 {loadingMentors ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {[1, 2].map((i) => <div key={i} className="aspect-[4/3] bg-white/5 rounded-[2.5rem] animate-pulse" />)}
                    </div>
                 ) : topMentors.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                       <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic tracking-[0.2em]">Node scanning in progress...</p>
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       {topMentors.map((m) => (
                          <MatchCard key={m._id} match={m} variant="mentor" compact={true} />
                       ))}
                    </div>
                 )}
              </section>
            </div>

            {/* SIDEBAR (4/12) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* PLATFORM ANALYTICS */}
              <section className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                  <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500">SYS_ACTIVITY</h4>
                  <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setChartFilter("week")} className={`px-3 py-1.5 rounded-lg text-[8px] font-black transition-all ${chartFilter === "week" ? "bg-[#FF7849] text-black shadow-lg" : "text-gray-500 hover:text-white"}`}>W</button>
                    <button onClick={() => setChartFilter("month")} className={`px-3 py-1.5 rounded-lg text-[8px] font-black transition-all ${chartFilter === "month" ? "bg-[#4F86C6] text-black shadow-lg" : "text-gray-500 hover:text-white"}`}>M</button>
                  </div>
                </div>
                <div className="w-full h-56 relative group/chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "12px" }}
                        itemStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        formatter={(val) => [`${val.toFixed(1)}H`, "DATA_VOL"]}
                      />
                      <Bar dataKey="platform" fill="#333" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="session" fill="#FF7849" radius={[6, 6, 0, 0]} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 10, fontWeight: "900" }} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-white/5" />
                </div>
              </section>

              {/* RECOMMENDED FOR YOU (BENTO SIDEBAR) */}
              <section className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7849]/5 blur-[60px] rounded-full" />
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4F86C6]">SYNAPTIC_MATCH</h4>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </div>

                <div className="space-y-4 relative z-10">
                  {loadingMatches ? (
                     [1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
                  ) : matches.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-white/5 rounded-2xl">
                       <p className="text-[9px] text-gray-700 font-black uppercase">No algorithmic output</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[8px] uppercase font-black text-gray-600 tracking-[0.3em] mb-4 italic">Prioritized Nodes_</p>
                      {matches.slice(0, 3).map((m, i) => (
                        <div key={m._id || i} onClick={() => navigate(`/user/${m._id}`)} className="group/match p-4 rounded-2xl bg-black/40 border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/10 rounded-xl flex items-center justify-center text-white font-black text-xs uppercase shadow-lg group-hover/match:scale-105 transition-transform duration-500">
                               {m.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-xs font-black text-white group-hover/match:text-[#4F86C6] transition-colors truncate tracking-widest capitalize">{m.name}</p>
                               <p className="text-[8px] text-[#4F86C6] font-black uppercase tracking-tighter mt-1 opacity-60">Match: {m.compatibilityScore}%</p>
                            </div>
                            <div className="text-[10px] text-gray-600 font-black italic shadow-inner">→</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => navigate("/explore")}
                  className="w-full mt-10 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-[#4F86C6] hover:text-white transition-all shadow-[0_15px_30px_-10px_rgba(255,255,255,0.1)] active:scale-95"
                >
                  Global Exploration
                </button>
              </section>

              {/* NETWORK PULSE */}
              <section className="bg-gradient-to-br from-[#111] to-[#080808] border border-white/10 rounded-[2.5rem] p-8">
                 <div className="flex justify-between items-center mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">COMMUNITY_CORE</h4>
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">1.4k synchronized</span>
                    </div>
                 </div>
                 
                 <div className="space-y-3 mb-10">
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group/node">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-xl bg-[#FF7849]/10 flex items-center justify-center">⚡</div>
                          <div>
                             <p className="text-[11px] font-black text-white/70 group-hover/node:text-white transition-colors">Frontend Masters 2026</p>
                             <p className="text-[8px] font-mono text-gray-600 mt-1 italic tracking-widest uppercase">Relay live in 1h 42m</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer group/node">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-xl bg-[#4F86C6]/10 flex items-center justify-center">⚙️</div>
                          <div>
                             <p className="text-[11px] font-black text-white/70 group-hover/node:text-white transition-colors">Distributed Systems Lab</p>
                             <p className="text-[8px] font-mono text-gray-600 mt-1 italic tracking-widest uppercase">7 active sync discussions</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <Link to="/communities" className="block w-full py-3.5 border border-white/10 text-white/30 text-center text-[9px] font-black uppercase tracking-[0.4em] rounded-2xl hover:border-white/40 hover:text-white transition-all">LINK_CHANNELS_ALL</Link>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}