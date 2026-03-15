import logo from "../assets/Logo.png";
import { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { RegisterUser } from "../utils/RegisterUser";
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegsiter = async () => {
    const res = await RegisterUser(email, password, name);
    console.log(res);
    if(res){
      navigate("/login")
    }
  };
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#121212] overflow-x-hidden">
      {/* LEFT SIDE: BRANDING SECTION */}
      <div className="w-full lg:w-1/2 bg-[#2A2A2A] p-6 lg:p-12 flex flex-col justify-between min-h-[40vh] lg:min-h-screen">
        {/* Logo & Brand Name */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
          />

          <Link to="/">
            <p className="font-mono text-xl lg:text-2xl text-white mt-2">
              UpSkillr
            </p>
          </Link>
        </div>

        {/* Hero Text */}
        <div className="mt-10 lg:mt-0 mb-10 lg:mb-20">
          <h1 className="text-white text-5xl md:text-7xl xl:text-8xl font-rose leading-tight">
            Join the
            <br />
            <span className="font-mono text-[#FF7849] text-6xl md:text-8xl xl:text-9xl">
              Exchange.
            </span>
          </h1>
          <p className="text-[#868686] text-sm md:text-lg lg:text-xl font-mono mt-4 tracking-wider">
            Teach what you know. Learn what you need.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: SIGNUP FORM */}
      <div className="w-full lg:w-1/2 bg-[#121212] flex flex-col relative">
        {/* Desktop Top Navigation (Hidden on Mobile) */}
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
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-0 pb-16 lg:pb-0">
          <div className="w-full max-w-md flex flex-col gap-6">
            <h2 className="font-rose text-white text-3xl lg:text-4xl text-center lg:text-left">
              Sign Up
            </h2>

            {/* Input Group */}
            <div className="space-y-4">
              <div className="w-full h-14 lg:h-16 rounded-xl border border-[#868686] focus-within:border-[#FF7849] transition-all">
                <input
                  type="text"
                  className="w-full h-full bg-transparent outline-none font-mono text-white px-6"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-full h-14 lg:h-16 rounded-xl border border-[#868686] focus-within:border-[#FF7849] transition-all">
                <input
                  type="email"
                  className="w-full h-full bg-transparent outline-none font-mono text-white px-6"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-full h-14 lg:h-16 rounded-xl border border-[#868686] focus-within:border-[#FF7849] transition-all">
                <input
                  type="password"
                  className="w-full h-full bg-transparent outline-none font-mono text-white px-6"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="w-full h-14 lg:h-16 rounded-xl border border-[#868686] focus-within:border-[#FF7849] transition-all">
                <input
                  type="password"
                  className="w-full h-full bg-transparent outline-none font-mono text-white px-6"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              className="w-full lg:w-fit px-10 h-12 bg-white text-black font-mono font-bold rounded-full text-lg hover:bg-gray-200 transition-colors self-center lg:self-start"
              onClick={handleRegsiter}
            >
              Start Swapping
            </button>

            {/* Footer Link */}
            <p className="text-[#868686] font-mono text-center lg:text-left mt-4">
              Already a member?{" "}
              <Link to="/login">
                <span className="text-[#4F86C6] hover:underline cursor-pointer font-bold">
                  Log In
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
