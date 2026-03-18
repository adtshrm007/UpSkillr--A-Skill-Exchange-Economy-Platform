import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import { useAuth } from "../context/Auth.context.jsx";
import { sessionService } from "../services/session.service.js";
import { matchesService } from "../services/matches.service.js";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
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
  }, []);

  const chartData = useMemo(() => {
    const now = new Date();
    
    if (chartFilter === "week") {
      const currentDay = now.getDay() === 0 ? 7 : now.getDay();
      const startOfCurrentWeek = new Date(now);
      startOfCurrentWeek.setDate(now.getDate() - currentDay + 1);
      startOfCurrentWeek.setHours(0, 0, 0, 0);

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const data = days.map(day => ({ day, hrs: 0 }));

      completedSessions.forEach(session => {
        if (!session.completedAt) return;
        const d = new Date(session.completedAt);
        if (d >= startOfCurrentWeek) {
          const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
          if (dayIndex >= 0 && dayIndex < 7) {
            data[dayIndex].hrs += session.durationHrs || 0;
          }
        }
      });
      return data;
    } else {
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const weeksData = [
        { day: "Week 1", hrs: 0 },
        { day: "Week 2", hrs: 0 },
        { day: "Week 3", hrs: 0 },
        { day: "Week 4", hrs: 0 },
        { day: "Week 5", hrs: 0 }
      ];

      completedSessions.forEach(session => {
        if (!session.completedAt) return;
        const d = new Date(session.completedAt);
        if (d >= startOfCurrentMonth && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
          const date = d.getDate();
          const weekIndex = Math.floor((date - 1) / 7);
          if (weekIndex >= 0 && weekIndex < 5) {
            weeksData[weekIndex].hrs += session.durationHrs || 0;
          }
        }
      });
      
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      if (daysInMonth <= 28) {
         weeksData.pop();
      }
      return weeksData;
    }
  }, [completedSessions, chartFilter]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setSkillCredits(user.skillCredits);
      setSkillLevel(user.skillLevel);
      setTeachingSkills(user.teachingSkills);
      setLearningSkills(user.learningSkills);
    }
  }, [user]);

  return (
    <div className="bg-[#080808] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-200 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-4 lg:p-10 lg:pl-32 xl:pl-40">
        <div className="max-w-full mx-auto space-y-10">
          {/* GREETING HEADER */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top duration-700">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#FF7849] font-black mb-1">
                System Status: Active
              </p>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter italic">
                HELLO, <span className="text-white uppercase">{name}</span>
              </h2>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2 text-right">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Level
                </p>
                <p className="text-xl font-black text-[#4F86C6]">{skillLevel}</p>
              </div>
              {skillCredits >= 1000 && (
                <Link to="/creator" className="mt-2 text-center px-4 py-2 bg-[#FF7849]/20 text-[#FF7849] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#FF7849] hover:text-black transition-all">
                  Creator Dashboard
                </Link>
              )}
            </div>
          </header>

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
                        Total Hours Taught
                      </p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-5xl font-black tracking-tighter text-white">
                        {user?.totalSessionsCompleted || 0}
                      </h3>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] mt-2">
                        Total Sessions
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
                    Your Stack
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {(teachingSkills || []).length === 0 ? (
                      <Link
                        to="/profile"
                        className="text-xs text-gray-600 italic hover:text-white transition-colors"
                      >
                        Add skills on your profile →
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
                    Target Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {(learningSkills || []).length === 0 ? (
                      <Link
                        to="/profile"
                        className="text-xs text-gray-600 italic hover:text-white transition-colors"
                      >
                        Add skill goals →
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
              <section className="bg-white/2 border border-white/5 p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest italic">
                    Upcoming Sessions
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
                        className="flex-1 h-20 bg-white/3 rounded-2xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 text-xs italic">
                      No upcoming sessions.
                    </p>
                    <Link
                      to="/explore"
                      className="text-[#4F86C6] text-xs font-bold hover:underline mt-2 block"
                    >
                      Find someone to learn from →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sessions.map((s) => (
                      <div
                        key={s._id}
                        className="bg-white/3 p-5 rounded-2xl border border-white/5"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-sm font-black">{s.skill}</h4>
                          <span className="text-[10px] font-black text-[#4F86C6] bg-[#4F86C6]/10 px-2 py-0.5 rounded">
                            {s.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          {new Date(s.scheduledAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-1">
                          {s.durationHrs}hr · {s.creditCost} credits
                        </p>
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
                        itemStyle={{ color: "#fff", fontSize: "10px" }}
                      />
                      <Bar dataKey="hrs" radius={[6, 6, 6, 6]}>
                        {chartData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={entry.hrs > 4 ? "#FF7849" : "#4F86C6"}
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
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

              {/* MATCHES */}
              <section className="bg-white/2 border border-white/5 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Live Connections
                  </h4>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_green]" />
                </div>
                <div className="space-y-4">
                  {loadingMatches ? (
                    [1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 bg-white/3 rounded-2xl animate-pulse"
                      />
                    ))
                  ) : matches.length === 0 ? (
                    <p className="text-gray-600 text-xs italic text-center py-4">
                      Add skills to find matches.
                    </p>
                  ) : (
                    matches.map((m, i) => (
                      <div
                        key={m._id || i}
                        className="p-4 rounded-2xl bg-white/3 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#4F86C6]/20 rounded-full flex items-center justify-center text-[#4F86C6] font-black text-xs uppercase">
                            {m.name?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black group-hover:text-[#4F86C6] transition-colors">
                              {m.name}
                            </p>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {m.teachingSkills?.slice(0, 2).map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="text-[7px] font-black text-gray-500 uppercase tracking-widest"
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
                    ))
                  )}
                </div>
                <button
                  onClick={() => navigate("/explore")}
                  className="w-full mt-6 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-gray-200 transition-all shadow-[0_10px_20px_-10px_rgba(255,255,255,0.2)]"
                >
                  Explore Network
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
