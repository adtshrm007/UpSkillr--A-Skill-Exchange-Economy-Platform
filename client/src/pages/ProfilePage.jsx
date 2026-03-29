import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import { useAuth } from "../context/Auth.context.jsx";
import { useToast } from "../context/Toast.context.jsx";
import { authService } from "../services/auth.service.js";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setTeachingSkills(user.teachingSkills || []);
      setLearningSkills(user.learningSkills || []);
    }
  }, [user]);

  const addTeachingSkill = () =>
    setTeachingSkills([...teachingSkills, { skillName: "", skillLevel: "Beginner" }]);

  const updateTeachingSkill = (i, field, val) => {
    const updated = [...teachingSkills];
    updated[i] = { ...updated[i], [field]: val };
    setTeachingSkills(updated);
  };

  const removeTeachingSkill = (i) =>
    setTeachingSkills(teachingSkills.filter((_, idx) => idx !== i));

  const addLearningSkill = () =>
    setLearningSkills([...learningSkills, { skillName: "" }]);

  const updateLearningSkill = (i, val) => {
    const updated = [...learningSkills];
    updated[i] = { ...updated[i], skillName: val };
    setLearningSkills(updated);
  };

  const removeLearningSkill = (i) =>
    setLearningSkills(learningSkills.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ message: "Name cannot be empty.", type: "error" });
      return;
    }
    setIsSaving(true);
    try {
      await authService.updateProfile({ name, bio, teachingSkills, learningSkills });
      await refreshUser();
      toast({ message: "Profile saved successfully!", type: "success" });
    } catch (err) {
      toast({ message: err.response?.data?.message || "Save failed. Please try again.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0F0F0F] text-white font-mono selection:bg-[#FF7849]/30">
      {/* LEFT PANEL: LIVE PREVIEW */}
      <div className="w-full lg:w-[45%] bg-[#161616] p-8 lg:p-16 border-r border-white/5 flex flex-col justify-between">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
            <p className="text-xl font-black tracking-tighter uppercase">UpSkillr</p>
          </div>

          {/* Reputation Badge */}
          {user?.reputationScore > 0 && (
            <div className="mb-6 inline-flex items-center gap-2 bg-[#FF7849]/10 border border-[#FF7849]/20 px-4 py-2 rounded-full">
              <span className="text-[#FF7849] text-sm font-black">★ {user.reputationScore}</span>
              <span className="text-gray-500 text-[10px] uppercase tracking-widest">{user.totalReviews} reviews</span>
            </div>
          )}

          <div className="space-y-4 mb-10">
            <h2 className="text-5xl lg:text-7xl font-black leading-none tracking-tighter break-words">
              {name || "User Name"}
            </h2>
            <p className="text-[#868686] text-lg font-medium">{user?.email || "email@example.com"}</p>
            {/* BUG FIX: was rendering "{bio}" as a literal string */}
            {bio && (
              <p className="text-gray-400 text-sm leading-relaxed max-w-md border-l-2 border-[#FF7849] pl-4 italic">
                "{bio}"
              </p>
            )}
          </div>

          {/* Credits Display */}
          <div className="mb-8 bg-white/3 border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">Skill Credits</span>
            <span className="text-2xl font-black text-[#FF7849]">{user?.skillCredits ?? 200} xp</span>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-[#FF7849] text-[10px] uppercase tracking-[0.2em] font-black italic border-b border-white/10 pb-2">Tech Stack (Teaching)</h3>
              <div className="space-y-4">
                {teachingSkills.map((s, i) => {
                  let progress = 30;
                  if (s.skillLevel === "Intermediate") progress = 60;
                  if (s.skillLevel === "Advanced") progress = 85;
                  if (s.skillLevel === "Expert") progress = 100;
                  
                  return (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white tracking-widest uppercase">{s.skillName}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] tracking-widest text-gray-500 uppercase font-bold">{s.skillLevel}</span>
                          <span className="text-[10px] text-[#FF7849] font-black bg-[#FF7849]/10 px-2 py-0.5 rounded">{progress * 10} XP</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-[#FF7849]/50 to-[#FF7849]" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                  );
                })}
                {!teachingSkills.length && <p className="text-gray-600 text-xs italic">No tech skills yet</p>}
              </div>
            </div>

            <div className="space-y-4 mt-2">
              <h3 className="text-[#4F86C6] text-[10px] uppercase tracking-[0.2em] font-black italic border-b border-white/10 pb-2">Learning Goals</h3>
              <div className="flex flex-wrap gap-2">
                {learningSkills.map((s, i) => (
                  <div key={i} className="bg-[#4F86C6]/10 border border-[#4F86C6]/20 px-4 py-2 rounded-xl text-xs font-bold text-[#4F86C6] uppercase tracking-widest">
                    {s.skillName}
                  </div>
                ))}
                {!learningSkills.length && <p className="text-gray-600 text-xs italic">No learning goals yet</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block pt-8 border-t border-white/5">
          <span className="text-[10px] text-gray-600 tracking-widest uppercase font-bold">Live Preview Mode</span>
        </div>
      </div>

      {/* RIGHT PANEL: EDIT FORM */}
      <div className="w-full lg:w-[55%] p-8 lg:p-20 overflow-y-auto max-h-screen">
        <div className="max-w-2xl mx-auto space-y-12">
          <header className="flex justify-between items-end border-b border-white/10 pb-6">
            <div>
              <h3 className="text-3xl font-black tracking-tight">Configuration</h3>
              <p className="text-gray-500 text-sm">Fine-tune your professional presence.</p>
            </div>
            <Link to="/dashboard" className="text-xs text-[#FF7849] font-bold hover:tracking-widest transition-all uppercase">
              ← Back
            </Link>
          </header>

          <section className="space-y-8">
            {/* Identity */}
            <div className="group space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 group-focus-within:text-[#FF7849] transition-colors">Legal Name</label>
              <input
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg px-4 py-3 outline-none focus:border-[#FF7849] transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Bio */}
            <div className="group space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500">Short Biography</label>
              <textarea
                rows="3"
                placeholder="Tell us about your journey..."
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg px-4 py-3 outline-none focus:border-white/20 transition-all resize-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Teaching Skills */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-[#FF7849] uppercase tracking-tighter">Teaching Stack</h4>
                <button onClick={addTeachingSkill} className="text-[9px] font-bold bg-[#FF7849] text-black px-3 py-1 rounded hover:scale-105 transition-transform">
                  + ADD SKILL
                </button>
              </div>
              <div className="space-y-3">
                {teachingSkills.map((skill, i) => (
                  <div key={i} className="flex gap-2 items-center bg-white/[0.02] p-2 rounded-xl border border-white/5">
                    <input
                      placeholder="Skill name..."
                      className="flex-1 bg-transparent px-2 py-1 outline-none text-sm"
                      value={skill.skillName}
                      onChange={(e) => updateTeachingSkill(i, "skillName", e.target.value)}
                    />
                    <select
                      className="bg-[#0F0F0F] text-[10px] border border-white/10 rounded px-2 py-1 outline-none"
                      value={skill.skillLevel}
                      onChange={(e) => updateTeachingSkill(i, "skillLevel", e.target.value)}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                    <button onClick={() => removeTeachingSkill(i)} className="p-2 text-gray-600 hover:text-red-500 transition-colors text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Skills */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-[#4F86C6] uppercase tracking-tighter">Growth Goals</h4>
                <button onClick={addLearningSkill} className="text-[9px] font-bold bg-[#4F86C6] text-black px-3 py-1 rounded hover:scale-105 transition-transform">
                  + ADD GOAL
                </button>
              </div>
              <div className="space-y-3">
                {learningSkills.map((skill, i) => (
                  <div key={i} className="flex gap-2 items-center bg-white/[0.02] p-2 rounded-xl border border-white/5">
                    <input
                      placeholder="Skill to learn..."
                      className="flex-1 bg-transparent px-2 py-1 outline-none text-sm"
                      value={skill.skillName}
                      onChange={(e) => updateLearningSkill(i, e.target.value)}
                    />
                    <button onClick={() => removeLearningSkill(i)} className="p-2 text-gray-600 hover:text-red-500 transition-colors text-xs">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <button
            disabled={isSaving}
            onClick={handleSave}
            className="group relative w-full bg-white text-black font-black py-5 rounded-lg overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <span className="relative z-10 uppercase tracking-widest">
              {isSaving ? "Syncing..." : "Commit Changes"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white group-hover:from-white group-hover:to-gray-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
