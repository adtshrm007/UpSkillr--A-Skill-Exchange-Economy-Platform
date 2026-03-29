import logo from "../../assets/Logo.png";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
import image4 from "../../assets/imag4.svg";
import image5 from "../../assets/image5.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";
import { useState } from "react";
import { useEffect } from "react";

const HeroSection = () => {
  const [name, setName] = useState("");
  const { loggedInUser } = useAuth();
  useEffect(() => {
    if (loggedInUser) {
      setName(loggedInUser);
    }
  }, [loggedInUser]);
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0A0A0A] font-mono text-gray-100 overflow-x-clip">
      {/* 1. FIXED HEADER */}
      <header className="fixed top-0 w-full z-100 px-8 py-5 flex items-center justify-between backdrop-blur-xl bg-[#0A0A0A]/70 border-b border-white/5">
        <div className="flex">
          <img
            src={logo}
            alt="logo"
            className="w-10 h-10 transition-transform group-hover:rotate-12 duration-500 size-5"
          />

          <span className="mt-2">UpSkillr</span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black">
          <p className="hover:text-white cursor-pointer transition-colors">
            How It Works
          </p>
          <div>
            <p className="hover:text-white cursor-pointer transition-colors">
              Community
            </p>
          </div>
          <Link to="/login">
            <div className="text-[#FF7849] bg-[#FF7849]/10 border border-[#FF7849]/20 px-6 py-2 rounded-full hover:bg-[#FF7849] hover:text-black transition-all">
              {loggedInUser?loggedInUser:"Login"}
            </div>
          </Link>
        </nav>
      </header>

      {/* 2. HERO CONTENT SECTION */}
      {/* Note: pt-24 ensures text starts below the header */}
      <main className="relative flex-1 flex flex-col lg:flex-row pt-24 lg:pt-0 min-h-screen items-center mt-11">
        {/* Background Mesh Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#FF7849]/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-[#4F86C6]/5 blur-[100px] rounded-full"></div>
        </div>

        {/* LEFT: CONTENT */}
        <section className="w-full lg:w-1/2 px-8 lg:px-24 flex flex-col justify-center z-10 py-12">
          <div className="space-y-8 max-w-xl">
            <div className="space-y-4">
              <div className="flex gap-3 mb-6 animate-pulse">
                <span className="bg-[#FF7849]/10 border border-[#FF7849]/20 text-[#FF7849] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  🔥 Trending: System Design
                </span>
                <span className="bg-[#4F86C6]/10 border border-[#4F86C6]/20 text-[#4F86C6] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full hidden sm:block">
                  Live Coding Sessions
                </span>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-rose leading-[1.1] tracking-tighter">
                <span className="text-[#4F86C6]">Master</span>
                <br />
                <span className="text-white font-black drop-shadow-[0_0_20px_rgba(255,120,73,0.3)]">
                  Tech Skills.
                </span>
              </h1>
              <h1 className="text-white text-5xl md:text-7xl font-rose leading-[1.1] tracking-tighter">
                <span className="text-[#FF7849] font-black drop-shadow-[0_0_20px_rgba(79,134,198,0.3)]">
                  Learn Anything.
                </span>
              </h1>
            </div>

            <p className="text-gray-500 text-sm md:text-lg leading-relaxed font-medium">
              UpSkillr is the developer-first ecosystem to learn, teach, and grow in tech. Swap tech skills directly with peers to collaborate, or earn skill credits by mentoring others. Start today with{" "}
              <span className="text-[#FF7849]">200 free skill credits</span>.
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              <Link to="/explore">
                <button className="group bg-white text-black px-8 py-4 rounded-3xl flex items-center gap-4 transition-all hover:bg-gray-200 active:scale-95 shadow-2xl">
                  <span className="font-black text-sm uppercase tracking-widest">
                    Start Learning
                  </span>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2">
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    >
                      <path
                        d="M5 12h14m-7-7l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              </Link>
              <Link to="/creator">
                <button className="group bg-transparent border-2 border-white/20 text-white px-8 py-4 rounded-3xl flex items-center gap-4 transition-all hover:bg-white/5 active:scale-95">
                  <span className="font-black text-sm uppercase tracking-widest">
                    Become a Mentor
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* RIGHT: FLOATING GRAPHICS */}
        <section className="w-full lg:w-1/2 p-8 lg:p-20 flex justify-center items-center relative h-full">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 flex items-center justify-center animate-[spin_40s_linear_infinite] opacity-10">
              <img
                src={image1}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 h-full relative z-10">
              <div className="space-y-6 pt-20">
                <div className="bg-[#161616] border border-white/10 rounded-4xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500">
                  <img
                    src={image2}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                </div>
                <div className="bg-[#161616] border border-white/10 rounded-4xl p-6 shadow-2xl ">
                  <img
                    src={image4}
                    alt=""
                    className="w-full h-auto opacity-80 animate-spin [animation-duration:5s]"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#161616] border border-white/10 rounded-4xl overflow-hidden shadow-2xl group">
                  <img
                    src={image5}
                    alt=""
                    className="w-full h-64 object-cover group-hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
                <div className="bg-[#161616] border border-white/10 rounded-4xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500">
                  <img
                    src={image3}
                    alt=""
                    className="w-full h-36 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HeroSection;
