import logo from "../assets/Logo.png";
import google from "../assets/google.svg";
import instagram from "../assets/instagram.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service.js";
import { useToast } from "../context/Toast.context.jsx";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Incomplete handshake. All fields required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Security keys do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Key strength insufficient. Min. 6 chars.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.register({ name: name.trim(), email, password });
      toast({ message: "Node Initialized! Received 200 credits 🎉", type: "success", duration: 5000 });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration sequence failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-[#0A0A0A] text-white font-mono selection:bg-[#FF7849]/30">
      {/* LEFT SIDE: BRANDING */}
      <div className="w-full lg:w-1/2 bg-[#121212] p-8 lg:p-20 flex flex-col justify-between border-r border-white/5 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF7849]/10 blur-[120px] rounded-full" />
        <div className="flex items-center gap-3 relative z-10 animate-in fade-in slide-in-from-left duration-500">
          <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
          <Link to="/">
            <p className="text-xl font-black tracking-tighter uppercase italic">UpSkillr</p>
          </Link>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0">
          <p className="text-[#FF7849] text-xs font-bold tracking-[0.4em] uppercase mb-4">New Node Registration</p>
          <h1 className="text-6xl md:text-8xl xl:text-9xl font-black leading-tight tracking-tighter">
            JOIN THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7849] to-white">NETWORK.</span>
          </h1>
          <p className="text-gray-500 text-lg mt-6 max-w-sm leading-relaxed">
            Secure your spot in the ecosystem and start your{" "}
            <span className="text-[#4F86C6] font-bold italic underline decoration-1">growth sprint</span> today.
          </p>

          <div className="mt-10 inline-flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 animate-in zoom-in duration-700 delay-300">
            <div className="w-10 h-10 bg-[#FF7849] rounded-full flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(255,120,73,0.4)]">
              ✦
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#FF7849]">Bonus Credits</p>
              <p className="text-xl font-black tracking-tighter">200 XP Awarded</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative z-10 border-t border-white/10 pt-8">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">© 2026 UpSkillr Neural Network</p>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 relative">
        <form onSubmit={handleRegister} className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
          <header className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight uppercase italic underline decoration-[#4F86C6] decoration-4">Sign Up</h2>
            <p className="text-gray-500 text-sm font-medium">Initialize your identity across the network.</p>
          </header>

          <div className="space-y-5">
            {[
              { label: "Primary ID", type: "text", placeholder: "Full Name", value: name, setter: setName, color: "#4F86C6" },
              { label: "Email Hash", type: "email", placeholder: "name@nexus.com", value: email, setter: setEmail, color: "#FF7849" },
              { label: "Security Key", type: "password", placeholder: "••••••••", value: password, setter: setPassword, color: "#4F86C6" },
              { label: "Confirm Key", type: "password", placeholder: "••••••••", value: confirmPassword, setter: setConfirmPassword, color: "#FF7849" },
            ].map((field) => (
              <div key={field.label} className="group space-y-2">
                <label 
                  className="text-[10px] uppercase font-black text-gray-500 transition-colors tracking-widest pl-1"
                  style={{ "--tw-text-opacity": "1" }}
                  onMouseEnter={(e) => e.target.style.color = field.color}
                  onMouseLeave={(e) => e.target.style.color = ""}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 outline-none transition-all text-sm placeholder:text-gray-700"
                  style={{ focusBorderColor: field.color }}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = field.color}
                  onBlur={(e) => e.target.style.borderColor = ""}
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-950/50 border border-red-500/30 text-red-300 text-xs px-4 py-3 rounded-xl font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-[0.2em] hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] disabled:opacity-50"
            >
              {loading ? "INITIALIZING NODE..." : "CREATE IDENTITY"}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-[#0A0A0A] px-4 text-gray-600">External Relays</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 py-3 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all group">
              <img src={google} alt="google" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" />
              <span className="text-[10px] font-bold uppercase text-gray-400">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 py-3 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all group">
              <img src={instagram} alt="instagram" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" />
              <span className="text-[10px] font-bold uppercase text-gray-400">Instagram</span>
            </button>
          </div>

          <p className="text-gray-500 text-xs text-center font-medium">
            Already registered?{" "}
            <Link to="/login" className="text-[#4F86C6] font-black uppercase tracking-tighter hover:underline">
              Initialize Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

