import logo from "../assets/Logo.png";
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
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.register({ name: name.trim(), email, password });
      toast({ message: "Account created! You received 200 credits 🎉", type: "success", duration: 5000 });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#121212] overflow-x-hidden">
      {/* LEFT SIDE: BRANDING */}
      <div className="w-full lg:w-1/2 bg-[#2A2A2A] p-6 lg:p-12 flex flex-col justify-between min-h-[40vh] lg:min-h-screen">
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-12 h-12 lg:w-16 lg:h-16 object-contain" />
          <Link to="/">
            <p className="font-mono text-xl lg:text-2xl text-white mt-2">UpSkillr</p>
          </Link>
        </div>
        <div className="mt-10 lg:mt-0 mb-10 lg:mb-20">
          <h1 className="text-white text-5xl md:text-7xl xl:text-8xl font-rose leading-tight">
            Join the
            <br />
            <span className="font-mono text-[#FF7849] text-6xl md:text-8xl xl:text-9xl">Exchange.</span>
          </h1>
          <p className="text-[#868686] text-sm md:text-lg lg:text-xl font-mono mt-4 tracking-wider">
            Teach what you know. Learn what you need.
          </p>
          <div className="mt-6 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
            <div className="w-8 h-8 bg-[#FF7849] rounded-full flex items-center justify-center text-black font-black text-sm">✦</div>
            <p className="text-white font-mono text-sm">
              <span className="font-black text-[#FF7849]">200 credits</span> awarded on signup
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: SIGNUP FORM */}
      <div className="w-full lg:w-1/2 bg-[#121212] flex flex-col relative">
        <div className="hidden lg:flex justify-end gap-8 p-8 text-[#868686] font-mono text-sm uppercase tracking-widest">
          <p className="hover:text-white cursor-pointer transition-colors">How It Works</p>
          <p className="hover:text-white cursor-pointer transition-colors">Community</p>
          <p className="hover:text-white cursor-pointer transition-colors">Stories</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-0 pb-16 lg:pb-0">
          <form onSubmit={handleRegister} className="w-full max-w-md flex flex-col gap-6">
            <h2 className="font-rose text-white text-3xl lg:text-4xl text-center lg:text-left">Sign Up</h2>

            <div className="space-y-4">
              {[
                { placeholder: "Full Name", value: name, setter: setName, type: "text", autoComplete: "name" },
                { placeholder: "Email", value: email, setter: setEmail, type: "email", autoComplete: "email" },
                { placeholder: "Password (min. 6 chars)", value: password, setter: setPassword, type: "password", autoComplete: "new-password" },
                { placeholder: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, type: "password", autoComplete: "new-password" },
              ].map(({ placeholder, value, setter, type, autoComplete }) => (
                <div key={placeholder} className="w-full h-14 lg:h-16 rounded-xl border border-[#868686] focus-within:border-[#FF7849] transition-all">
                  <input
                    type={type}
                    autoComplete={autoComplete}
                    className="w-full h-full bg-transparent outline-none font-mono text-white px-6 placeholder:text-gray-600"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                  />
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-500/30 text-red-300 text-xs px-4 py-3 rounded-xl font-mono font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full lg:w-fit px-10 h-12 bg-white text-black font-mono font-bold rounded-full text-lg hover:bg-gray-200 transition-colors self-center lg:self-start disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Start Swapping"}
            </button>

            <p className="text-[#868686] font-mono text-center lg:text-left">
              Already a member?{" "}
              <Link to="/login">
                <span className="text-[#4F86C6] hover:underline cursor-pointer font-bold">Log In</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
