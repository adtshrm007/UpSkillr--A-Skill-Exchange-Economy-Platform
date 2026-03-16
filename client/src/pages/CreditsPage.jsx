import { useEffect, useState } from "react";
import NavBar from "../components/common/Navbar";
import { creditsService } from "../services/credits.service.js";
import { useAuth } from "../context/Auth.context.jsx";
import { useToast } from "../context/Toast.context.jsx";

export default function CreditsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    creditsService.getTransactions({ page, limit: 15 })
      .then((r) => {
        setTransactions(r.data.transactions || []);
        setTotalPages(r.data.totalPages || 1);
      })
      .catch(() => toast({ message: "Failed to load transactions.", type: "error" }))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="bg-[#080808] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-200 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-4 lg:p-10 lg:pl-32 xl:pl-40">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <header className="animate-in fade-in slide-in-from-top duration-700">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#FF7849] font-black mb-1">Economy</p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">SKILL <span className="text-[#FF7849]">CREDITS</span></h1>
          </header>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#FF7849]/20 to-[#4F86C6]/10 border border-[#FF7849]/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#FF7849]/10 blur-[80px] rounded-full pointer-events-none" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#FF7849] font-black mb-3">Current Balance</p>
            <div className="flex items-end gap-3">
              <span className="text-7xl font-black tracking-tighter">{user?.skillCredits ?? 0}</span>
              <span className="text-2xl text-[#FF7849] font-black mb-2">XP</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Earned</p>
                <p className="text-lg font-black text-green-400">
                  {transactions.filter((t) => t.type === "CREDIT").reduce((s, t) => s + t.amount, 0)}
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Spent</p>
                <p className="text-lg font-black text-red-400">
                  {Math.abs(transactions.filter((t) => t.type === "DEBIT").reduce((s, t) => s + t.amount, 0))}
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Txns</p>
                <p className="text-lg font-black">{transactions.length}</p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <section className="bg-white/2 border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6">Transaction History</h3>

            {loading ? (
              <div className="space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-14 bg-white/3 rounded-xl animate-pulse" />)}</div>
            ) : transactions.length === 0 ? (
              <p className="text-gray-600 text-xs italic text-center py-8">No transactions yet.</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((t) => (
                  <div key={t._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/3 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                        t.type === "CREDIT"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {t.type === "CREDIT" ? "+" : "−"}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{t.reason}</p>
                        <p className="text-[10px] text-gray-600">
                          {new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-sm ${t.type === "CREDIT" ? "text-green-400" : "text-red-400"}`}>
                        {t.type === "CREDIT" ? "+" : ""}{t.amount} xp
                      </p>
                      <p className="text-[10px] text-gray-600">{t.balanceAfter} xp bal.</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

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
