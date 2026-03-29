import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/common/Navbar";
import { authService } from "../services/auth.service.js";
import { reviewService } from "../services/review.service.js";
import { sessionService } from "../services/session.service.js";
import { useAuth } from "../context/Auth.context.jsx";
import { useToast } from "../context/Toast.context.jsx";

export default function PublicProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  


  // Session State
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionSkill, setSessionSkill] = useState("");
  const [offeredSkill, setOfferedSkill] = useState("");
  const [duration, setDuration] = useState(1);
  const [date, setDate] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    Promise.all([
      authService.getPublicProfile(id),
      reviewService.getByUser(id, { limit: 5 })
    ])
      .then(([profRes, revRes]) => {
        setProfile(profRes.data);
        setReviews(revRes.data.reviews || []);
      })
      .catch((err) => {
        console.error(err)
        toast({ message: "Failed to load profile", type: "error" });
      })
      .finally(() => setLoading(false));
  }, [id, toast]);



  const handleBookSession = async () => {
    if (!sessionSkill || !date) {
      toast({ message: "Select skill and date", type: "error" });
      return;
    }
    setBooking(true);
    try {
      await sessionService.book({
        teacherId: profile._id,
        requestedSkill: sessionSkill,
        offeredSkill,
        scheduledAt: date,
        durationHrs: duration,
      });
      toast({ message: `Session booked with ${profile.name}!`, type: "success" });
      setShowSessionForm(false);
    } catch (e) {
      toast({ message: e.response?.data?.message || "Failed to book session", type: "error" });
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p>Profile not found.</p>
      </div>
    );
  }

  const isSelf = currentUser?._id === profile._id;

  return (
    <div className="bg-[#0A0A0A] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-100 overflow-x-hidden">
      <NavBar />
      <main className="flex-1 p-6 lg:p-12 lg:pl-36 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <Link to="/explore" className="text-xs uppercase tracking-widest text-[#FF7849] hover:underline font-bold">← Back to Explore</Link>
          
          <header className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-linear-to-br from-[#4F86C6]/30 to-[#FF7849]/20 flex items-center justify-center text-white font-black text-4xl uppercase shrink-0">
              {profile.name?.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-2">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight">{profile.name}</h1>
                {profile.reputationScore > 0 && (
                  <div className="bg-[#FF7849]/10 border border-[#FF7849]/20 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-[#FF7849] font-black text-sm">★ {profile.reputationScore}</span>
                  </div>
                )}
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded uppercase tracking-widest">{profile.skillLevel}</span>
              </div>
              
              <div className="flex gap-6 mt-4 opacity-70 border-b border-white/10 pb-6">
                <div>
                  <p className="text-2xl font-black text-white">{profile.totalSessionsCompleted}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Sessions</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{profile.totalHoursTaught}h</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Taught</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{profile.totalReviews}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Reviews</p>
                </div>
              </div>
              
              {profile.bio && (
                <p className="text-gray-400 mt-6 max-w-2xl leading-relaxed italic border-l-2 border-[#FF7849] pl-4">
                  "{profile.bio}"
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            {!isSelf && (
              <div className="w-full md:w-auto flex flex-col gap-3 shrink-0">
                <button 
                  onClick={() => setShowSessionForm(!showSessionForm)}
                  className="w-full py-4 px-8 bg-[#4F86C6] text-white font-black text-xs uppercase tracking-widest rounded-2xl flex-1 hover:bg-[#6a9fd4] transition-all"
                >
                  Book Session
                </button>
              </div>
            )}
          </header>

          {showSessionForm && (
            <section className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-4 max-w-xl">
                <h3 className="text-sm font-black text-[#4F86C6] uppercase tracking-widest">
                  Book Session {offeredSkill ? "(Mutual Swap - Free)" : `(Costs ${duration * 10} credits)`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select value={sessionSkill} onChange={e => setSessionSkill(e.target.value)} className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4F86C6]">
                    <option value="" disabled>I want to learn...</option>
                    {profile.teachingSkills?.map((s, idx) => (
                      <option key={idx} value={s.skillName}>{s.skillName}</option>
                    ))}
                  </select>

                  <select value={offeredSkill} onChange={e => setOfferedSkill(e.target.value)} className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4F86C6]">
                    <option value="">I can teach in return (Optional)...</option>
                    {currentUser?.teachingSkills?.map((s, idx) => (
                      <option key={idx} value={s.skillName}>{s.skillName}</option>
                    ))}
                  </select>

                  <input type="number" min="0.5" max="8" step="0.5" value={duration} onChange={e => setDuration(e.target.value)} className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4F86C6]" title="Duration (Hrs)" />
                  <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#4F86C6]" />
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleBookSession} disabled={booking} className="px-6 py-2 bg-[#4F86C6] text-white text-xs font-black rounded-lg hover:bg-opacity-80 disabled:opacity-50">
                    {booking ? "Booking..." : offeredSkill ? `Book Free Swap` : `Book for ${duration * 10} Credits`}
                  </button>
                  <button onClick={() => setShowSessionForm(false)} className="px-6 py-2 bg-transparent text-white text-xs font-black rounded-lg hover:bg-white/5">Cancel</button>
                </div>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills */}
            <div className="space-y-8">
              <section className="bg-white/2 border border-white/5 rounded-3xl p-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF7849] mb-6">Teaching Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.teachingSkills?.length ? profile.teachingSkills.map((s, i) => (
                    <span key={i} className="bg-[#FF7849]/10 border border-[#FF7849]/20 text-[#FF7849] px-4 py-2 rounded-xl text-xs font-black">
                      {s.skillName} <span className="opacity-50 font-normal ml-1">({s.skillLevel})</span>
                    </span>
                  )) : (
                    <p className="text-gray-600 text-xs italic">No teaching skills listed.</p>
                  )}
                </div>
              </section>

              <section className="bg-white/2 border border-white/5 rounded-3xl p-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F86C6] mb-6">Learning Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.learningSkills?.length ? profile.learningSkills.map((s, i) => (
                    <span key={i} className="bg-[#4F86C6]/10 border border-[#4F86C6]/20 text-[#4F86C6] px-4 py-2 rounded-xl text-xs font-black">
                      {s.skillName}
                    </span>
                  )) : (
                    <p className="text-gray-600 text-xs italic">No learning goals listed.</p>
                  )}
                </div>
              </section>
            </div>

            {/* Reviews */}
            <div className="space-y-8">
              <section className="bg-white/2 border border-white/5 rounded-3xl p-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6">Recent Reviews</h3>
                {reviews.length ? (
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <div key={r._id} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                              {r.reviewer?.name?.charAt(0)}
                            </div>
                            <span className="text-xs font-black">{r.reviewer?.name}</span>
                          </div>
                          <span className="text-[#FF7849] text-xs font-black">{"★".repeat(r.rating)}</span>
                        </div>
                        {r.comment && <p className="text-xs text-gray-400 mt-2 italic">"{r.comment}"</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-xs italic">No reviews yet.</p>
                )}
              </section>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
