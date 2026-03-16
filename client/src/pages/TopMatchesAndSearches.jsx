import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import { matchesService } from "../services/matches.service.js";
import { swapService } from "../services/swap.service.js";
import { useAuth } from "../context/Auth.context.jsx";
import { useToast } from "../context/Toast.context.jsx";

function MatchCard({ match, onSendSwap }) {
  const [showSwapForm, setShowSwapForm] = useState(false);
  const [mySkill, setMySkill] = useState("");
  const [theirSkill, setTheirSkill] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendSwap = async () => {
    if (!mySkill || !theirSkill) { toast({ message: "Select both skills.", type: "error" }); return; }
    setSending(true);
    try {
      await onSendSwap({ recipientId: match._id, requesterSkill: mySkill, recipientSkill: theirSkill });
      toast({ message: `Swap request sent to ${match.name}!`, type: "success" });
      setShowSwapForm(false);
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to send swap.", type: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white/2 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group flex flex-col gap-4">
      {/* User Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4F86C6]/30 to-[#FF7849]/20 flex items-center justify-center text-white font-black text-base uppercase">
            {match.name?.charAt(0)}
          </div>
          <div>
            <p className="font-black text-base group-hover:text-[#4F86C6] transition-colors">{match.name}</p>
            <p className="text-[10px] text-gray-600">{match.email}</p>
            {match.reputationScore > 0 && (
              <p className="text-[10px] text-[#FF7849] font-black mt-0.5">★ {match.reputationScore} ({match.totalReviews} reviews)</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-green-400">{match.compatibilityScore}%</p>
          <p className="text-[8px] text-gray-600 uppercase tracking-widest">match</p>
        </div>
      </div>

      {match.bio && <p className="text-xs text-gray-500 italic border-l border-white/10 pl-3 line-clamp-2">"{match.bio}"</p>}

      {/* Skills */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[8px] text-[#FF7849] uppercase tracking-widest font-black mb-1.5">Teaches</p>
          <div className="flex flex-wrap gap-1.5">
            {match.teachingSkills?.slice(0, 3).map((s, i) => (
              <span key={i} className="text-[10px] bg-[#FF7849]/10 border border-[#FF7849]/20 text-[#FF7849] px-2 py-0.5 rounded-full font-black">{s.skillName}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[8px] text-[#4F86C6] uppercase tracking-widest font-black mb-1.5">Wants to Learn</p>
          <div className="flex flex-wrap gap-1.5">
            {match.learningSkills?.slice(0, 3).map((s, i) => (
              <span key={i} className="text-[10px] bg-[#4F86C6]/10 border border-[#4F86C6]/20 text-[#4F86C6] px-2 py-0.5 rounded-full font-black">{s.skillName}</span>
            ))}
          </div>
        </div>
      </div>
      {/* Actions */}
      {!showSwapForm ? (
        <button
          onClick={() => setShowSwapForm(true)}
          className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF7849] hover:text-black hover:border-[#FF7849] transition-all"
        >
          Request Swap ⇄
        </button>
      ) : (
        <div className="space-y-3 bg-white/3 rounded-2xl p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Swap Request</p>
          <input
            placeholder="Skill you'll teach..."
            value={mySkill}
            onChange={(e) => setMySkill(e.target.value)}
            className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#FF7849]"
          />
          <input
            placeholder="Skill you want from them..."
            value={theirSkill}
            onChange={(e) => setTheirSkill(e.target.value)}
            className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#4F86C6]"
          />
          <div className="flex gap-2">
            <button onClick={handleSendSwap} disabled={sending} className="flex-1 py-2.5 bg-[#FF7849] text-black text-[10px] font-black rounded-xl hover:bg-[#ff8f63] disabled:opacity-50 transition-all">
              {sending ? "Sending..." : "Send Request"}
            </button>
            <button onClick={() => setShowSwapForm(false)} className="px-4 py-2.5 bg-white/5 border border-white/10 text-[10px] font-black rounded-xl hover:bg-white/10 transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

  const handleSendSwap = async (data) => {
    await swapService.request(data);
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-100 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-6 lg:p-12 lg:pl-36 lg:pb-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#4F86C6] font-black mb-1">Smart Matching</p>
                <h2 className="text-4xl font-black tracking-tight uppercase">Discover <span className="text-[#4F86C6]">Partners</span></h2>
              </div>
              <Link to="/dashboard" className="text-xs uppercase tracking-widest text-[#FF7849] hover:underline font-bold">← Dashboard</Link>
            </div>

            {!user?.teachingSkills?.length && !user?.learningSkills?.length && (
              <div className="bg-amber-950/30 border border-amber-500/20 rounded-2xl px-5 py-4">
                <p className="text-amber-300 text-xs font-bold">
                  💡 Add skills to your <Link to="/profile" className="underline">profile</Link> to enable smart matching.
                </p>
              </div>
            )}

            {/* Search */}
            <form onSubmit={handleSearch} className="relative group w-full lg:max-w-3xl flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 640 640">
                    <path fill="currentColor" d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for skills (e.g. React, Python, UI Design)..."
                  className="w-full bg-[#161616] border border-white/10 rounded-[24px] py-5 pl-14 pr-6 text-sm outline-none focus:border-[#4F86C6]/50 focus:shadow-[0_0_30px_rgba(79,134,198,0.1)] transition-all placeholder:text-gray-600"
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-[#4F86C6] text-black font-black text-[10px] uppercase tracking-widest rounded-[24px] hover:bg-[#6a9fd4] transition-all flex-shrink-0">
                Search
              </button>
            </form>
          </div>

          {/* Matches Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map((i) => <div key={i} className="h-64 bg-white/3 rounded-3xl animate-pulse" />)}
            </div>
          ) : matches.length === 0 ? (
            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-[40px]">
              <p className="text-gray-500 italic uppercase text-xs tracking-widest">No matches found.</p>
              <p className="text-gray-600 text-xs mt-2">Try adding more skills to your profile or broaden your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {matches.map((m) => (
                <MatchCard key={m._id} match={m} onSendSwap={handleSendSwap} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-3">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="text-[10px] font-black px-4 py-2 border border-white/10 rounded-xl hover:border-white/30 disabled:opacity-30 transition-all">← Prev</button>
              <span className="text-[10px] text-gray-500 flex items-center">{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="text-[10px] font-black px-4 py-2 border border-white/10 rounded-xl hover:border-white/30 disabled:opacity-30 transition-all">Next →</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
