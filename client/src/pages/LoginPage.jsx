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
  const navigate = useNavigate();
  const handleLogin = async () => {
    const res = await loginUser(email, password);
    console.log(res);
    if (res) {
      navigate("/dashboard");
    }
  };
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden bg-[#121212]">
      {/* LEFT SIDE: WELCOME SECTION */}
      <div className="w-full lg:w-1/2 bg-[#2A2A2A] p-6 lg:p-12 flex flex-col justify-between min-h-[40vh] lg:min-h-screen">
        {/* Logo & Name */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 lg:w-14 lg:h-14 object-contain"
          />
          <Link to="/">
            <p className="font-mono text-xl lg:text-2xl text-white mt-1">
              UpSkillr
            </p>
          </Link>
        </div>

        {/* Hero Text */}
        <div className="mt-10 lg:mt-0 mb-10 lg:mb-20">
          <h1 className="text-white text-5xl md:text-7xl xl:text-8xl font-rose leading-tight">
            Welcome
            <br />
            <span className="font-mono text-[#4F86C6] text-6xl md:text-8xl xl:text-9xl">
              Back.
            </span>
          </h1>
          <p className="text-[#868686] text-sm md:text-lg lg:text-xl font-mono mt-4 tracking-wider">
            Ready to <span className="text-[#FF7849]">Learn</span> ?
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 bg-[#121212] flex flex-col relative">
        {/* Desktop Top Nav Items */}
        <div className="hidden lg:flex justify-end gap-8 p-8 text-[#868686] font-mono text-sm uppercase tracking-widest">
          <p className="hover:text-white cursor-pointer transition-colors">
            How It Works
          </p>
          <p className="hover:text-white cursor-pointer transition-colors">
            Community
          </p>
          <p className="hover:text-white cursor-pointer transition-colors">
            Stories
          </p>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-0">
          <div className="w-full max-w-md flex flex-col gap-8">
            <h2 className="font-rose text-white text-3xl lg:text-4xl text-center lg:text-left">
              Log In
            </h2>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="w-full h-14 lg:h-16 rounded-xl border border-[#868686] focus-within:border-[#4F86C6] transition-all">
                <input
                  type="email"
                  className="w-full h-full bg-transparent outline-none font-mono text-white px-6"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-full h-14 lg:h-16 rounded-xl border border-[#868686] focus-within:border-[#4F86C6] transition-all">
                <input
                  type="password"
                  className="w-full h-full bg-transparent outline-none font-mono text-white px-6"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              className="w-full lg:w-40 h-12 bg-white text-black font-mono font-bold rounded-full text-lg hover:bg-gray-200 transition-colors self-center lg:self-start"
              onClick={handleLogin}
            >
              Log In
            </button>

            {/* Social Logins */}
            <div className="space-y-3 mt-4">
              <button className="w-full h-14 rounded-xl flex items-center justify-center gap-4 border border-[#868686] hover:bg-white/5 transition-all">
                <img src={google} alt="google" className="w-6 h-6" />
                <p className="text-sm md:text-base font-mono text-[#868686]">
                  Continue With Google
                </p>
              </button>
              <button className="w-full h-14 rounded-xl flex items-center justify-center gap-4 border border-[#868686] hover:bg-white/5 transition-all">
                <img src={instagram} alt="instagram" className="w-6 h-6" />
                <p className="text-sm md:text-base font-mono text-[#868686]">
                  Continue With Instagram
                </p>
              </button>
            </div>

            {/* Footer Link */}
            <p className="text-[#868686] font-mono text-center lg:text-left mt-4">
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="text-[#FF7849] hover:underline cursor-pointer">
                  Sign Up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
