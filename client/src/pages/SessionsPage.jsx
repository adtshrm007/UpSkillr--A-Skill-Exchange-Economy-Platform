import { useEffect, useState } from "react";
import NavBar from "../components/common/Navbar";
import { sessionService } from "../services/session.service.js";
import { useToast } from "../context/Toast.context.jsx";

const STATUS_COLORS = {
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Confirmed: "text-green-400 bg-green-400/10 border-green-400/20",
  Completed: "text-[#4F86C6] bg-[#4F86C6]/10 border-[#4F86C6]/20",
  Cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

function SessionCard({ session, onCancel, onComplete, userId }) {
  const isTeacher = session.teacher?._id === userId || session.teacher === userId;
  const other = isTeacher ? session.learner : session.teacher;
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    if (!confirm("Cancel this session? Your credits will be refunded.")) return;
    setCancelling(true);
    try {
      await onCancel(session._id);
      toast({ message: "Session cancelled. Credits refunded.", type: "success" });
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to cancel session.", type: "error" });
    } finally {
      setCancelling(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await onComplete(session._id);
      toast({ message: `Session complete! You earned ${session.creditCost} credits.`, type: "success" });
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to complete session.", type: "error" });
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="bg-white/2 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-black">{session.skill}</h3>
          <p className="text-gray-500 text-xs mt-1">{isTeacher ? "Teaching" : "Learning"} · {session.durationHrs}hr</p>
        </div>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${STATUS_COLORS[session.status] || "text-gray-400 bg-white/5 border-white/10"}`}>
          {session.status}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[#4F86C6]/20 flex items-center justify-center text-[#4F86C6] font-black text-xs">
          {other?.name?.charAt(0) || "?"}
        </div>
        <div>
          <p className="text-xs font-bold">{other?.name || "Unknown"}</p>
          <p className="text-[10px] text-gray-600">{other?.email}</p>
        </div>
        {other?.reputationScore > 0 && (
          <span className="ml-auto text-[10px] text-[#FF7849] font-black">★ {other.reputationScore}</span>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-[10px] text-gray-500">
            {new Date(session.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-[10px] text-gray-600 mt-0.5">{session.creditCost} credits</p>
        </div>

        {["Pending", "Confirmed"].includes(session.status) && (
          <div className="flex gap-2">
            {isTeacher && session.status === "Confirmed" && (
              <button onClick={handleComplete} disabled={completing} className="text-[10px] font-black bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-xl hover:bg-green-500/30 transition-all disabled:opacity-50">
                {completing ? "..." : "Complete"}
              </button>
            )}
            <button onClick={handleCancel} disabled={cancelling} className="text-[10px] font-black bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50">
              {cancelling ? "..." : "Cancel"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchSessions = async (f, p) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 8 };
      if (f !== "all") params.status = f;
      const r = await sessionService.getMy(params);
      setSessions(r.data.sessions || []);
      setTotalPages(r.data.totalPages || 1);
    } catch {
      toast({ message: "Failed to load sessions.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(filter, page); }, [filter, page]);

  const handleCancel = async (id) => {
    await sessionService.cancel(id);
    fetchSessions(filter, page);
  };

  const handleComplete = async (id) => {
    await sessionService.complete(id);
    fetchSessions(filter, page);
  };

  const FILTERS = ["all", "Confirmed", "Pending", "Completed", "Cancelled"];

  return (
    <div className="bg-[#080808] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-200 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-4 lg:p-10 lg:pl-32 xl:pl-40">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top duration-700">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#4F86C6] font-black mb-1">Learning Pipeline</p>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">MY <span className="text-[#4F86C6]">SESSIONS</span></h1>
            </div>
          </header>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                  filter === f
                    ? "bg-white text-black border-white"
                    : "bg-white/3 border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>

          {/* Sessions Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-52 bg-white/3 rounded-3xl animate-pulse" />)}
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/5 rounded-[40px]">
              <p className="text-gray-500 text-xs uppercase tracking-widest italic">No sessions found.</p>
              <p className="text-gray-600 text-xs mt-2">Explore partners and book your first session.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sessions.map((s) => (
                <SessionCard key={s._id} session={s} onCancel={handleCancel} onComplete={handleComplete} />
              ))}
            </div>
          )}

          {/* Pagination */}
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
