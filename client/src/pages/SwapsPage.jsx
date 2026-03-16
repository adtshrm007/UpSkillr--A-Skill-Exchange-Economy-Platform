import { useEffect, useState } from "react";
import NavBar from "../components/common/Navbar";
import { swapService } from "../services/swap.service.js";
import { useAuth } from "../context/Auth.context.jsx";
import { useToast } from "../context/Toast.context.jsx";

const STATUS_STYLES = {
  Requested: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Accepted: "text-green-400 bg-green-400/10 border-green-400/20",
  Scheduled: "text-[#4F86C6] bg-[#4F86C6]/10 border-[#4F86C6]/20",
  Completed: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function SwapsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scheduling, setScheduling] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");

  const fetchSwaps = async (f, p) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 8 };
      if (f !== "all") params.status = f;
      const r = await swapService.getMy(params);
      setSwaps(r.data.swaps || []);
      setTotalPages(r.data.totalPages || 1);
    } catch {
      toast({ message: "Failed to load swaps.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSwaps(filter, page); }, [filter, page]);

  const handleRespond = async (id, action) => {
    try {
      await swapService.respond(id, action);
      toast({ message: action === "accept" ? "Swap accepted! 🎉" : "Swap declined.", type: action === "accept" ? "success" : "info" });
      fetchSwaps(filter, page);
    } catch (e) {
      toast({ message: e.response?.data?.message || "Action failed.", type: "error" });
    }
  };

  const handleSchedule = async (id) => {
    if (!scheduleDate) { toast({ message: "Please pick a date/time.", type: "error" }); return; }
    try {
      await swapService.schedule(id, scheduleDate);
      toast({ message: "Swap scheduled!", type: "success" });
      setScheduling(null);
      setScheduleDate("");
      fetchSwaps(filter, page);
    } catch (e) {
      toast({ message: e.response?.data?.message || "Scheduling failed.", type: "error" });
    }
  };

  const handleCancel = async (id) => {
    try {
      await swapService.cancel(id);
      toast({ message: "Swap cancelled.", type: "info" });
      fetchSwaps(filter, page);
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to cancel.", type: "error" });
    }
  };

  const handleComplete = async (id) => {
    try {
      await swapService.complete(id);
      toast({ message: "Swap marked as complete! Leave a review.", type: "success" });
      fetchSwaps(filter, page);
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to complete.", type: "error" });
    }
  };

  const FILTERS = ["all", "Requested", "Accepted", "Scheduled", "Completed", "Cancelled"];

  return (
    <div className="bg-[#080808] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-200 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-4 lg:p-10 lg:pl-32 xl:pl-40">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="animate-in fade-in slide-in-from-top duration-700">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#FF7849] font-black mb-1">Skill Exchange</p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">MY <span className="text-[#FF7849]">SWAPS</span></h1>
          </header>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                  filter === f ? "bg-white text-black border-white" : "bg-white/3 border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Swaps List */}
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-40 bg-white/3 rounded-3xl animate-pulse" />)}</div>
          ) : swaps.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/5 rounded-[40px]">
              <p className="text-gray-500 text-xs uppercase tracking-widest italic">No swaps found.</p>
              <p className="text-gray-600 text-xs mt-2">Find a match and send a swap request.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {swaps.map((swap) => {
                const isRequester = swap.requester?._id === user?._id;
                const other = isRequester ? swap.recipient : swap.requester;
                const mySkill = isRequester ? swap.requesterSkill : swap.recipientSkill;
                const theirSkill = isRequester ? swap.recipientSkill : swap.requesterSkill;

                return (
                  <div key={swap._id} className="bg-white/2 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FF7849]/20 flex items-center justify-center text-[#FF7849] font-black text-sm">
                            {other?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-sm">{other?.name}</p>
                            <p className="text-[10px] text-gray-500">{other?.email}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${STATUS_STYLES[swap.status] || ""}`}>
                        {swap.status}
                      </span>
                    </div>

                    {/* Skill Exchange */}
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <div className="bg-[#FF7849]/10 border border-[#FF7849]/20 px-4 py-2 rounded-xl text-xs font-black text-[#FF7849]">
                        You offer: {mySkill}
                      </div>
                      <span className="text-gray-600 font-black">↔</span>
                      <div className="bg-[#4F86C6]/10 border border-[#4F86C6]/20 px-4 py-2 rounded-xl text-xs font-black text-[#4F86C6]">
                        They offer: {theirSkill}
                      </div>
                    </div>

                    {swap.scheduledAt && (
                      <p className="text-[10px] text-gray-500 mb-4">
                        Scheduled: {new Date(swap.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      {!isRequester && swap.status === "Requested" && (
                        <>
                          <button onClick={() => handleRespond(swap._id, "accept")} className="text-[10px] font-black bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition-all">Accept</button>
                          <button onClick={() => handleRespond(swap._id, "reject")} className="text-[10px] font-black bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all">Decline</button>
                        </>
                      )}
                      {["Accepted"].includes(swap.status) && (
                        <>
                          {scheduling === swap._id ? (
                            <div className="flex gap-2 items-center flex-wrap">
                              <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="bg-[#1A1A1A] border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#4F86C6]" />
                              <button onClick={() => handleSchedule(swap._id)} className="text-[10px] font-black bg-[#4F86C6]/20 border border-[#4F86C6]/30 text-[#4F86C6] px-4 py-2 rounded-xl hover:bg-[#4F86C6]/30 transition-all">Confirm</button>
                              <button onClick={() => setScheduling(null)} className="text-[10px] text-gray-500 px-3 py-2">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setScheduling(swap._id)} className="text-[10px] font-black bg-[#4F86C6]/20 border border-[#4F86C6]/30 text-[#4F86C6] px-4 py-2 rounded-xl hover:bg-[#4F86C6]/30 transition-all">Schedule</button>
                          )}
                        </>
                      )}
                      {swap.status === "Scheduled" && (
                        <button onClick={() => handleComplete(swap._id)} className="text-[10px] font-black bg-purple-500/20 border border-purple-500/30 text-purple-400 px-4 py-2 rounded-xl hover:bg-purple-500/30 transition-all">Mark Complete</button>
                      )}
                      {!["Completed", "Cancelled"].includes(swap.status) && (
                        <button onClick={() => handleCancel(swap._id)} className="text-[10px] font-black bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-all">Cancel</button>
                      )}
                    </div>
                  </div>
                );
              })}
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
