import { useEffect, useState } from "react";
import NavBar from "../components/common/Navbar";
import { adminService } from "../services/admin.service.js";
import { useToast } from "../context/Toast.context.jsx";

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white/2 border border-white/5 rounded-3xl p-6">
      <p className="text-[10px] uppercase tracking-[0.3em] font-black mb-2" style={{ color: accent }}>{label}</p>
      <p className="text-4xl font-black tracking-tighter">{value ?? <span className="w-20 h-8 bg-white/5 rounded animate-pulse inline-block" />}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toggling, setToggling] = useState(null);

  useEffect(() => {
    adminService.getStats().then((r) => setStats(r.data)).catch(() => toast({ message: "Failed to load stats.", type: "error" }));
  }, []);

  useEffect(() => {
    setLoading(true);
    adminService.getUsers({ page, limit: 15, search })
      .then((r) => { setUsers(r.data.users || []); setTotalPages(r.data.totalPages || 1); })
      .catch(() => toast({ message: "Failed to load users.", type: "error" }))
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const r = await adminService.toggleStatus(id);
      toast({ message: r.data.message, type: r.data.isActive ? "success" : "warning" });
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: r.data.isActive } : u));
    } catch (e) {
      toast({ message: e.response?.data?.message || "Toggle failed.", type: "error" });
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="bg-[#080808] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-200 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-4 lg:p-10 lg:pl-32 xl:pl-40">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <header className="animate-in fade-in slide-in-from-top duration-700">
            <p className="text-[10px] uppercase tracking-[0.4em] text-red-400 font-black mb-1">Admin Control</p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">PLATFORM <span className="text-red-400">COMMAND</span></h1>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Users" value={stats?.totalUsers} accent="#4F86C6" />
            <StatCard label="Sessions" value={stats?.totalSessions} accent="#FF7849" />
            <StatCard label="Completed" value={stats?.completedSessions} accent="#4F86C6" />
            <StatCard label="Credits XP" value={stats?.creditsInCirculation} accent="#FF7849" />
          </div>

          {/* User Management */}
          <section className="bg-white/2 border border-white/5 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xs font-black uppercase tracking-widest">User Management</h3>
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#4F86C6]/50 placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-2 text-gray-500 uppercase tracking-widest font-black">User</th>
                    <th className="text-left py-3 px-2 text-gray-500 uppercase tracking-widest font-black">Credits</th>
                    <th className="text-left py-3 px-2 text-gray-500 uppercase tracking-widest font-black">Rep</th>
                    <th className="text-left py-3 px-2 text-gray-500 uppercase tracking-widest font-black">Level</th>
                    <th className="text-left py-3 px-2 text-gray-500 uppercase tracking-widest font-black">Joined</th>
                    <th className="text-left py-3 px-2 text-gray-500 uppercase tracking-widest font-black">Status</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? [1,2,3,4,5].map((i) => (
                        <tr key={i} className="border-b border-white/5">
                          {[1,2,3,4,5,6,7].map((j) => <td key={j} className="py-3 px-2"><div className="h-4 bg-white/3 rounded animate-pulse" /></td>)}
                        </tr>
                      ))
                    : users.map((u) => (
                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#4F86C6]/20 flex items-center justify-center text-[#4F86C6] font-black text-[10px]">
                                {u.name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold">{u.name}</p>
                                <p className="text-[10px] text-gray-600">{u.email}</p>
                              </div>
                              {u.isAdmin && <span className="text-[8px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-black border border-red-500/20">ADMIN</span>}
                            </div>
                          </td>
                          <td className="py-3 px-2 font-black text-[#FF7849]">{u.skillCredits} xp</td>
                          <td className="py-3 px-2">{u.reputationScore > 0 ? `★ ${u.reputationScore}` : "—"}</td>
                          <td className="py-3 px-2 text-gray-400">{u.skillLevel}</td>
                          <td className="py-3 px-2 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${u.isActive ? "text-green-400 bg-green-400/10 border-green-400/20" : "text-red-400 bg-red-400/10 border-red-400/20"}`}>
                              {u.isActive ? "Active" : "Suspended"}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            {!u.isAdmin && (
                              <button
                                onClick={() => handleToggle(u._id)}
                                disabled={toggling === u._id}
                                className={`text-[9px] font-black px-3 py-1.5 rounded-xl border transition-all disabled:opacity-50 ${
                                  u.isActive
                                    ? "text-red-400 border-red-400/20 hover:bg-red-400/10"
                                    : "text-green-400 border-green-400/20 hover:bg-green-400/10"
                                }`}
                              >
                                {toggling === u._id ? "..." : u.isActive ? "Suspend" : "Activate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-3 pt-2">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="text-[10px] font-black px-4 py-2 border border-white/10 rounded-xl hover:border-white/30 disabled:opacity-30 transition-all">← Prev</button>
                <span className="text-[10px] text-gray-500 flex items-center">{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="text-[10px] font-black px-4 py-2 border border-white/10 rounded-xl hover:border-white/30 disabled:opacity-30 transition-all">Next →</button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
