import { getDashboard } from "../utils/getDashboard";
import NavBar from "../components/common/Navbar";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";

export default function DashboardPage() {
  // --- STATIC DATA ARRAYS ---
  const name = "Alex";
  const id = "123";

  const weeklyProgress = [
    { day: "Mon", hrs: 2 },
    { day: "Tue", hrs: 4 },
    { day: "Wed", hrs: 1.5 },
    { day: "Thu", hrs: 5.2 },
    { day: "Fri", hrs: 3 },
    { day: "Sat", hrs: 6 },
    { day: "Sun", hrs: 4 },
  ];

  const teachingSkills = [
    { skillOffered: "React.js", level: "Expert" },
    { skillOffered: "UI Design", level: "Intermediate" },
  ];

  const learningSkills = [
    { skillToLearn: "TypeScript" },
    { skillToLearn: "Node.js" },
  ];

  const enrollments = [
    {
      _id: "e1",
      course: { title: "Advanced Backend Architecture" },
      progress: 65,
    },
    { _id: "e2", course: { title: "Modern UX Fundamentals" }, progress: 40 },
  ];

  const recommendations = [
    {
      _id: "r1",
      title: "Rust Mastery",
      instructor: { name: "Sarah" },
      level: "Advanced",
    },
    {
      _id: "r2",
      title: "Three.js Basics",
      instructor: { name: "Mike" },
      level: "Beginner",
    },
  ];

  const matches = [
    {
      name: "Jordan Doe",
      matchedSkills: [{ skillOffered: "Rust" }, { skillOffered: "Go" }],
    },
    { name: "Sam Smith", matchedSkills: [{ skillOffered: "DevOps" }] },
  ];

  const acceptedRequests = [];
  const totalPages = 1;
  const page = 1;

  const handleSeeMore = () => console.log("Loading more...");

  getDashboard();

  return (
    <>
      <div className="bg-[#0A0A0A] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-100 overflow-x-hidden">
        <NavBar />

        <main className="flex-1 p-6 lg:p-12 lg:pl-36 lg:pb-12 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-12">
            <header className="flex flex-col gap-1 font-mono">
              <h2 className="text-3xl font-bold tracking-tight">
                <span className="text-[#FF7849]">Welcome</span>{" "}
                <span className="text-[#4F86C6]">back</span>, {name}!
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                Nice to see you and have a good day.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-8 space-y-10">
                {/* HERO ANALYTICS */}
                <div className="w-full bg-[#161616] border border-white/5 rounded-[40px] p-8 lg:p-10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group shadow-2xl">
                  <div className="flex-1 w-full space-y-6 z-10">
                    <div>
                      <h3 className="text-4xl lg:text-5xl font-black tracking-tighter text-white">
                        11 <span className="text-[#4F86C6]">hrs</span>
                      </h3>
                      <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mt-1">
                        Investment in skills
                      </p>
                    </div>
                    <div className="w-full h-32 opacity-80 group-hover:opacity-100 transition-opacity">
                      <svg
                        viewBox="0 0 400 100"
                        className="w-full h-full overflow-visible"
                      >
                        <defs>
                          <linearGradient
                            id="areaGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#4F86C6"
                              stopOpacity="0.3"
                            />
                            <stop
                              offset="100%"
                              stopColor="#4F86C6"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,80 C50,90 80,30 150,50 C220,70 280,10 400,30 V100 H0 Z"
                          fill="url(#areaGrad)"
                        />
                        <path
                          d="M0,80 C50,90 80,30 150,50 C220,70 280,10 400,30"
                          fill="none"
                          stroke="#FF7849"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <circle
                          cx="280"
                          cy="10"
                          r="5"
                          fill="#FF7849"
                          className="animate-pulse shadow-[0_0_10px_#FF7849]"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-[#0A0A0A] rounded-[30px] p-8 border border-white/5 flex flex-col items-center gap-6 w-full md:w-64">
                    <div className="relative w-32 h-32">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          className="text-white/5"
                          strokeWidth="10"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-[#FF7849]"
                          strokeWidth="10"
                          strokeDasharray="20"
                          strokeDashoffset="5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-2xl tracking-tighter">
                        10%
                      </div>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-tight">
                      Progress rate
                    </p>
                  </div>
                </div>

                {/* SKILLS BOXES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="bg-[#161616] border border-white/5 p-8 rounded-[40px] space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#FF7849] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7849]"></span>{" "}
                      Sharing
                    </h3>
                    <div className="space-y-3">
                      {teachingSkills.map((s, i) => (
                        <div
                          key={i}
                          className="bg-[#0A0A0A]/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-[#FF7849]/50 transition-all"
                        >
                          <span className="text-sm font-medium">
                            {s.skillOffered}
                          </span>
                          <span className="text-[10px] font-black text-[#FF7849] bg-[#FF7849]/10 px-3 py-1 rounded-md uppercase">
                            {s.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="bg-[#161616] border border-white/5 p-8 rounded-[40px] space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#4F86C6] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F86C6]"></span>{" "}
                      Learning
                    </h3>
                    <div className="space-y-3">
                      {learningSkills.map((s, i) => (
                        <div
                          key={i}
                          className="bg-[#0A0A0A]/50 p-4 rounded-2xl border border-white/5 text-sm font-medium hover:border-[#4F86C6]/50 transition-all"
                        >
                          {s.skillToLearn}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* RESTORED COURSE PROGRESS */}
                <section className="bg-[#161616] border border-white/5 p-8 rounded-[40px] space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#4F86C6] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F86C6]"></span>{" "}
                    Course Progress
                  </h3>
                  <div className="space-y-3">
                    {enrollments.map((e) => (
                      <div
                        key={e._id}
                        className="bg-[#0A0A0A]/50 p-4 rounded-2xl border border-white/5"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            {e.course?.title}
                          </span>
                          <span className="text-[10px] font-black text-[#FF7849]">
                            {e.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-[#161616] rounded-full h-1.5">
                          <div
                            className="bg-[#FF7849] h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${e.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* RESTORED RECOMMENDED COURSES */}
                <section className="bg-[#161616] border border-white/5 p-8 rounded-[40px] space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#FF7849] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF7849]"></span>{" "}
                    Recommended
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((course) => (
                      <Link
                        key={course._id}
                        to={`/courses/${course._id}`}
                        className="bg-[#0A0A0A]/50 p-4 rounded-2xl border border-white/5 hover:border-[#FF7849]/50 transition-all group"
                      >
                        <p className="text-sm font-bold group-hover:text-[#FF7849] transition-colors">
                          {course.title}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          By {course.instructor?.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-4 space-y-10">
                {/* NEW WEEKLY PROGRESS */}
                <section className="bg-[#161616] border border-white/5 rounded-[40px] p-8 shadow-xl">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
                    Weekly Activity
                  </h4>
                  <div className="w-full h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyProgress}>
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#4b5563",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.05)" }}
                          contentStyle={{
                            backgroundColor: "#161616",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "10px",
                          }}
                        />
                        <Bar dataKey="hrs" radius={[4, 4, 4, 4]}>
                          {weeklyProgress.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.hrs > 5 ? "#FF7849" : "#4F86C6"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* MATCHES */}
                <section className="bg-[#161616] border border-white/5 rounded-[40px] p-8">
                  <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h4 className="text-lg font-black uppercase tracking-tighter">
                      Matches
                    </h4>
                  </header>
                  <div className="space-y-4">
                    {matches.map((m, i) => (
                      <div
                        key={i}
                        className="bg-[#121212] p-5 rounded-[30px] border border-white/5 hover:bg-[#1A1A1A] transition-all cursor-pointer group"
                      >
                        <p className="font-bold text-sm mb-2 group-hover:text-[#4F86C6] transition-colors">
                          {m.name}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {m.matchedSkills.map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[8px] font-bold bg-white/5 text-gray-400 px-2 py-1 rounded-lg uppercase tracking-wider"
                            >
                              {sk.skillOffered}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-8 w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-transform">
                    Expand Matches
                  </button>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
