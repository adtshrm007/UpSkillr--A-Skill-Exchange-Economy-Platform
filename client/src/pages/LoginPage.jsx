import logo from "../assets/Logo.png";
import google from "../assets/google.svg";
import instagram from "../assets/instagram.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../utils/LoginUser";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    const res = await loginUser(email, password);
    if (res) {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-[#0A0A0A] text-white font-mono selection:bg-[#4F86C6]/30">
      {/* LEFT SIDE: BRANDING & WELCOME */}
      <div className="w-full lg:w-1/2 bg-[#121212] p-8 lg:p-20 flex flex-col justify-between border-r border-white/5 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4F86C6]/10 blur-[120px] rounded-full" />

        <div className="flex items-center gap-3 relative z-10 animate-in fade-in slide-in-from-left duration-500">
          <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
          <Link to="/">
            <p className="text-xl font-black tracking-tighter uppercase italic">
              UpSkillr
            </p>
          </Link>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0">
          <p className="text-[#4F86C6] text-xs font-bold tracking-[0.4em] uppercase mb-4">
            Verification Required
          </p>
          <h1 className="text-6xl md:text-8xl xl:text-9xl font-black leading-tight tracking-tighter">
            WELCOME <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F86C6] to-white">
              BACK.
            </span>
          </h1>
          <p className="text-gray-500 text-lg mt-6 max-w-sm leading-relaxed">
            Re-enter the ecosystem to continue your{" "}
            <span className="text-[#FF7849] font-bold italic underline decoration-1">
              growth sprint
            </span>
            .
          </p>
        </div>

        <div className="hidden lg:block relative z-10 border-t border-white/10 pt-8">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            © 2026 UpSkillr Neural Network
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-24 relative">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-bottom duration-700">
          <header className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight uppercase italic underline decoration-[#FF7849] decoration-4">
              Log In
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Identify yourself to access your dashboard.
            </p>
          </header>

          <div className="space-y-6">
            {/* Input Group */}
            <div className="space-y-4">
              <div className="group space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-500 group-focus-within:text-[#4F86C6] transition-colors tracking-widest pl-1">
                  Email Hash
                </label>
                <input
                  type="email"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#4F86C6] focus:bg-white/[0.05] transition-all text-sm placeholder:text-gray-700"
                  placeholder="name@nexus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="group space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-500 group-focus-within:text-[#FF7849] transition-colors tracking-widest pl-1">
                  Access Key
                </label>
                <input
                  type="password"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#FF7849] focus:bg-white/[0.05] transition-all text-sm placeholder:text-gray-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-[0.2em] hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)] disabled:opacity-50"
            >
              {loading ? "Decrypting..." : "Initialize Session"}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-[#0A0A0A] px-4 text-gray-600">
                External Relays
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 py-3 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all group">
              <img
                src={google}
                alt="google"
                className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all"
              />
              <span className="text-[10px] font-bold uppercase text-gray-400">
                Google
              </span>
            </button>
            <button className="flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 py-3 rounded-xl hover:bg-white/[0.08] hover:border-white/20 transition-all group">
              <img
                src={instagram}
                alt="instagram"
                className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all"
              />
              <span className="text-[10px] font-bold uppercase text-gray-400">
                Instagram
              </span>
            </button>
          </div>

          <p className="text-gray-500 text-xs text-center font-medium">
            New to the network?{" "}
            <Link
              to="/signup"
              className="text-[#FF7849] font-black uppercase tracking-tighter hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
