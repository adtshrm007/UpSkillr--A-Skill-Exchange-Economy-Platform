import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";
import { useDashboard } from "../context/Dashboard.context";
import { updateProfile } from "../utils/updateProfile";

export default function Profile() {
  const { user } = useDashboard();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState(""); // New Bio State
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || ""); // Initialize bio
      setTeachingSkills(user.teachingSkills || []);
      setLearningSkills(user.learningSkills || []);
    }
  }, [user]);

  const handleAddingNewTeachingSkills = () => {
    setTeachingSkills([
      ...teachingSkills,
      { skillName: "", skillLevel: "Beginner" },
    ]);
  };

  const updateTeachingSkill = (index, field, value) => {
    const updated = [...teachingSkills];
    updated[index] = { ...updated[index], [field]: value };
    setTeachingSkills(updated);
  };

  const removeTeachingSkills = (index) => {
    setTeachingSkills(teachingSkills.filter((_, i) => i !== index));
  };

  const handleAddingNewLearningSkills = () => {
    setLearningSkills([...learningSkills, { skillName: "" }]);
  };

  const updateLearningSkill = (index, value) => {
    const updated = [...learningSkills];
    updated[index] = { ...updated[index], skillName: value };
    setLearningSkills(updated);
  };

  const removeLearningSkills = (index) => {
    setLearningSkills(learningSkills.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const data = { name, email, bio, teachingSkills, learningSkills };
    try {
      await updateProfile(data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0F0F0F] text-white font-mono selection:bg-[#FF7849]/30">
      {/* LEFT PANEL: PREVIEW */}
      <div className="w-full lg:w-[45%] bg-[#161616] p-8 lg:p-16 border-r border-white/5 flex flex-col justify-between">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
            <p className="text-xl font-black tracking-tighter uppercase">
              UpSkillr
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <h2 className="text-5xl lg:text-7xl font-black leading-none tracking-tighter break-words">
              {name || "User Name"}
            </h2>
            <p className="text-[#868686] text-lg font-medium">
              {email || "email@example.com"}
            </p>
            {bio && (
              <p className="text-gray-400 text-sm leading-relaxed max-w-md border-l-2 border-[#FF7849] pl-4 italic">
                "{bio}"
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-[#FF7849] text-[10px] uppercase tracking-[0.2em] font-black italic">
                  Teaching
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teachingSkills.map((s, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px]"
                    >
                      {s.skillName}{" "}
                      <span className="opacity-40 ml-1">[{s.skillLevel}]</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-[#4F86C6] text-[10px] uppercase tracking-[0.2em] font-black italic">
                  Learning
                </h3>
                <div className="flex flex-wrap gap-2">
                  {learningSkills.map((s, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[11px]"
                    >
                      {s.skillName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block pt-8 border-t border-white/5">
          <span className="text-[10px] text-gray-600 tracking-widest uppercase font-bold">
            Live Preview Mode
          </span>
        </div>
      </div>

      {/* RIGHT PANEL: EDIT FORM */}
      <div className="w-full lg:w-[55%] p-8 lg:p-20 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-12">
          <header className="flex justify-between items-end border-b border-white/10 pb-6">
            <div>
              <h3 className="text-3xl font-black tracking-tight">
                Configuration
              </h3>
              <p className="text-gray-500 text-sm">
                Fine-tune your professional presence.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-xs text-[#FF7849] font-bold hover:tracking-widest transition-all uppercase"
            >
              ← Back
            </Link>
          </header>

          <section className="space-y-8">
            {/* Identity Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 group-focus-within:text-[#FF7849] transition-colors">
                  Legal Name
                </label>
                <input
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg px-4 py-3 outline-none focus:border-[#FF7849] transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="group space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 group-focus-within:text-[#4F86C6] transition-colors">
                  Public Email
                </label>
                <input
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg px-4 py-3 outline-none focus:border-[#4F86C6] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Bio Section */}
            <div className="group space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500">
                Short Biography
              </label>
              <textarea
                rows="3"
                placeholder="Tell us about your journey..."
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-lg px-4 py-3 outline-none focus:border-white/20 transition-all resize-none"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Skills: Teaching */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-[#FF7849] uppercase tracking-tighter">
                  Teaching Stack
                </h4>
                <button
                  onClick={handleAddingNewTeachingSkills}
                  className="text-[9px] font-bold bg-[#FF7849] text-black px-3 py-1 rounded hover:scale-105 transition-transform"
                >
                  + ADD SKILL
                </button>
              </div>
              <div className="space-y-3">
                {teachingSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-center bg-white/[0.02] p-2 rounded-xl border border-white/5"
                  >
                    <input
                      placeholder="Skill"
                      className="flex-1 bg-transparent px-2 py-1 outline-none text-sm"
                      value={skill.skillName}
                      onChange={(e) =>
                        updateTeachingSkill(i, "skillName", e.target.value)
                      }
                    />
                    <select
                      className="bg-[#0F0F0F] text-[10px] border border-white/10 rounded px-2 py-1 outline-none"
                      value={skill.skillLevel}
                      onChange={(e) =>
                        updateTeachingSkill(i, "skillLevel", e.target.value)
                      }
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                    <button
                      onClick={() => removeTeachingSkills(i)}
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills: Learning */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-black text-[#4F86C6] uppercase tracking-tighter">
                  Growth Goals
                </h4>
                <button
                  onClick={handleAddingNewLearningSkills}
                  className="text-[9px] font-bold bg-[#4F86C6] text-black px-3 py-1 rounded hover:scale-105 transition-transform"
                >
                  + ADD GOAL
                </button>
              </div>
              <div className="space-y-3">
                {learningSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex gap-2 items-center bg-white/[0.02] p-2 rounded-xl border border-white/5"
                  >
                    <input
                      placeholder="Skill to learn..."
                      className="flex-1 bg-transparent px-2 py-1 outline-none text-sm"
                      value={skill.skillName}
                      onChange={(e) => updateLearningSkill(i, e.target.value)}
                    />
                    <button
                      onClick={() => removeLearningSkills(i)}
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <button
            disabled={isSaving}
            onClick={handleSaveChanges}
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
