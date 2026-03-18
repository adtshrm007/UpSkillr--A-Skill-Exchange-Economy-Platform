import { useEffect, useState } from "react";
import NavBar from "../components/common/Navbar";
import { notificationService } from "../services/notification.service.js";
import { useToast } from "../context/Toast.context.jsx";

const TYPE_ICONS = {
  SESSION_BOOKED: "📅",
  SESSION_CANCELLED: "✕",
  SESSION_COMPLETED: "★",
  CREDITS_CHANGED: "⬡",
  MATCH_FOUND: "◎",
  REVIEW_RECEIVED: "★",
};

const TYPE_COLORS = {
  SESSION_BOOKED: "text-[#4F86C6]",
  SESSION_CANCELLED: "text-red-400",
  SESSION_COMPLETED: "text-green-400",
  CREDITS_CHANGED: "text-[#FF7849]",
  MATCH_FOUND: "text-[#4F86C6]",
  REVIEW_RECEIVED: "text-amber-400",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchNotifs = async (p) => {
    setLoading(true);
    try {
      const r = await notificationService.getAll({ page: p, limit: 15 });
      setNotifications(r.data.notifications || []);
      setUnreadCount(r.data.unreadCount || 0);
      setTotalPages(r.data.totalPages || 1);
    } catch {
      toast({ message: "Failed to load notifications.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifs(page); }, [page]);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast({ message: "All notifications marked as read.", type: "success" });
    } catch {
      toast({ message: "Failed to mark all read.", type: "error" });
    }
  };

  return (
    <div className="bg-[#080808] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-200 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-4 lg:p-10 lg:pl-32 xl:pl-40">
        <div className="max-w-2xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top duration-700">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#FF7849] font-black mb-1">System Alerts</p>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">
                NOTIFICATIONS
                {unreadCount > 0 && (
                  <span className="ml-3 text-lg bg-[#FF7849] text-black font-black px-3 py-1 rounded-full">{unreadCount}</span>
                )}
              </h1>
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                Mark all read
              </button>
            )}
          </header>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map((i) => <div key={i} className="h-20 bg-white/3 rounded-2xl animate-pulse" />)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/5 rounded-[40px]">
              <p className="text-gray-500 text-xs uppercase tracking-widest italic mb-2">All caught up!</p>
              <p className="text-gray-600 text-xs">No notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && handleMarkRead(n._id)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer group ${
                    n.read
                      ? "bg-white/[0.02] border-white/5 opacity-60"
                      : "bg-white/[0.04] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-base flex-shrink-0 ${TYPE_COLORS[n.type] || "text-gray-400"}`}>
                    {TYPE_ICONS[n.type] || "●"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-[#FF7849] rounded-full mt-2 flex-shrink-0 animate-pulse" />}
                </div>
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
