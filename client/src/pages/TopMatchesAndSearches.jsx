import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import MatchCard from "../components/ui/MatchCard";
import { matchesService } from "../services/matches.service.js";
import { useAuth } from "../context/Auth.context.jsx";
import { useToast } from "../context/Toast.context.jsx";

export default function TopMatchesAndSearches() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMatches = async (s, p) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 9 };
      if (s) params.skill = s;
      const r = await matchesService.find(params);
      setMatches(r.data.matches || []);
      setTotalPages(r.data.totalPages || 1);
    } catch (e) {
      if (e.response?.status !== 401) toast({ message: "Failed to load matches.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(search, page); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMatches(search, 1);
  };

  return (
    <div className="bg-[#080808] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-200 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-4 lg:p-10 lg:pl-32 xl:pl-44 overflow-y-auto">
        <div className="max-w-full mx-auto space-y-12">
          {/* HEADER SECTION */}
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 animate-in fade-in slide-in-from-top duration-700">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#FF7849] font-black mb-2 px-1">
                SYNAPTIC_SCAN: OPERATIONAL
              </p>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter italic uppercase mb-2">
                DISCOVER <span className="text-white">PARTNERS</span>
              </h2>
              <p className="text-xs text-gray-500 font-bold max-w-lg leading-relaxed uppercase tracking-widest pl-1">
                Identify complementary skill profiles for immediate collaboration and growth.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:text-[#4F86C6] transition-all"
            >
              ← System Dashboard
            </Link>
          </header>

          {/* STATUS NOTIFICATION */}
          {!user?.teachingSkills?.length && !user?.learningSkills?.length && (
            <section className="bg-gradient-to-r from-[#FF7849]/10 via-[#111] to-transparent border border-[#FF7849]/20 p-5 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FF7849]/20 flex items-center justify-center text-[#FF7849] animate-pulse font-black">
                !
              </div>
              <div>
                <h3 className="text-[10px] font-black text-[#FF7849] uppercase tracking-widest mb-0.5">Algorithm Standby</h3>
                <p className="text-[11px] text-gray-400 font-bold">
                  Define your skill hash in <Link to="/profile" className="text-[#FF7849] underline underline-offset-4 decoration-1">Profile Settings</Link> to optimize matching accuracy.
                </p>
              </div>
            </section>
          )}

          {/* SEARCH TERMINAL */}
          <section className="relative">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#FF7849]/50 group-focus-within:text-[#FF7849] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="EX: FULL_STACK_OPTIMIZATION"
                  className="w-full bg-[#111] border border-white/10 rounded-[2rem] py-5 lg:py-6 pl-16 pr-8 text-sm outline-none focus:border-[#FF7849] focus:bg-[#161616] transition-all placeholder:text-gray-700 font-bold tracking-widest uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-10 py-5 lg:py-6 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] hover:bg-[#4F86C6] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)]"
              >
                Start Scan
              </button>
            </form>
          </section>

          {/* RESULTS GRID */}
          <section className="min-h-[40vh]">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse" />
                ))}
              </div>
            ) : matches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-2xl opacity-20">📡</div>
                <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">No Active Matches</p>
                <p className="text-gray-700 text-[10px] mt-4 font-bold uppercase tracking-widest">Adjust search frequency or update profiles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 animate-in fade-in duration-1000">
                {matches.map((m) => (
                  <MatchCard key={m._id} match={m} />
                ))}
              </div>
            )}
          </section>

          {/* PAGINATION INTERFACE */}
          {totalPages > 1 && (
            <footer className="flex justify-center items-center gap-6 pt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-4 border border-white/10 rounded-2xl hover:border-[#4F86C6] disabled:opacity-20 hover:text-[#4F86C6] transition-all active:scale-[0.95]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <div className="bg-white/5 border border-white/10 px-8 py-3 rounded-2xl">
                <span className="text-xs font-black tracking-[0.2em]">
                  <span className="text-[#FF7849]">{page}</span>
                  <span className="text-gray-600 mx-3">/</span>
                  <span className="text-white">{totalPages}</span>
                </span>
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-4 border border-white/10 rounded-2xl hover:border-[#FF7849] disabled:opacity-20 hover:text-[#FF7849] transition-all active:scale-[0.95]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
}

