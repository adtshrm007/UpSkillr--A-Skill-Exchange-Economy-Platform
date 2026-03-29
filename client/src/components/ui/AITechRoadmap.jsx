import Footer from "./Footer";
import { Link } from "react-router-dom";

export default function AITechRoadmap() {
  return (
    <section className="w-full min-h-screen bg-[#0A0A0A] flex flex-col font-mono text-white relative overflow-hidden border-t border-white/5">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[20%] left-[-5%] w-72 h-72 bg-[#FF7849]/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-72 h-72 bg-[#4F86C6]/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-8 py-20 z-10">
        {/* LEFT: TEXT SECTION */}
        <div className="w-full lg:w-1/2 max-w-xl space-y-10">
          <header className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-green-500">AI-Powered Learning Experience</p>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
              Know Your <br />
              <span className="text-[#FF7849] drop-shadow-[0_0_15px_rgba(255,120,73,0.3)]">
                Next Move
              </span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md">
              Our AI engine analyzes your Tech Stack to provide a personalized roadmap, smart mentor and peer matching, suggested next steps, and continuous learning optimization.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#161616] border border-white/10 rounded-xl p-4">
               <h4 className="text-xs font-black text-[#4F86C6] uppercase tracking-widest mb-2">Smart Matching</h4>
               <p className="text-[10px] text-gray-500 font-bold">AI identifies the best mentors and peers based on your learning goals.</p>
            </div>
            <div className="bg-[#161616] border border-white/10 rounded-xl p-4">
               <h4 className="text-xs font-black text-[#FF7849] uppercase tracking-widest mb-2">Personalized Roadmap</h4>
               <p className="text-[10px] text-gray-500 font-bold">Suggested next steps and learning optimization curated for your goals.</p>
            </div>
          </div>

          <Link to="/explore">
            <button className="mt-8 bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF7849] hover:text-black transition-all duration-300 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Generate My Roadmap
            </button>
          </Link>
        </div>

        {/* RIGHT: UI MOCK SECTION */}
        <div className="w-full lg:w-1/2 max-w-md relative group">
          <div className="absolute inset-0 bg-[#4F86C6]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          {/* MOCKED UI REPRESENTATION */}
          <div className="relative bg-[#0F0F0F] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl p-6 transition-transform duration-500 hover:-translate-y-2">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
               <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Recommended Path</p>
               <span className="text-[10px] bg-[#FF7849]/10 text-[#FF7849] px-2 py-0.5 rounded font-black uppercase">Frontend Engineer</span>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 blur-[2px]"></div>
                  <div className="w-0.5 h-10 bg-white/10 mt-2"></div>
                </div>
                <div>
                   <h5 className="text-sm font-black text-white">Master React Context API</h5>
                   <p className="text-[10px] text-gray-400 mt-1">Status: Completed</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-[#FF7849] shadow-[0_0_10px_rgba(255,120,73,0.5)]"></div>
                  <div className="w-0.5 h-10 bg-white/10 mt-2"></div>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-xl w-full hover:border-[#FF7849]/50 transition-colors cursor-pointer">
                   <h5 className="text-sm font-black text-white">Solve 5 Graph DSA Problems</h5>
                   <p className="text-[10px] text-gray-400 mt-1 mb-2">Your next immediate step</p>
                   <button className="text-[8px] bg-[#FF7849] text-black px-2 py-1 rounded-sm uppercase font-black uppercase">Start Now</button>
                </div>
              </div>

               {/* Step 3 */}
               <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-white/20 border border-white/50"></div>
                </div>
                <div>
                   <h5 className="text-sm font-black text-gray-500">System Design Mock Interview</h5>
                   <p className="text-[10px] text-gray-600 mt-1">Unlock by completing previous steps</p>
                </div>
              </div>
            </div>

            {/* Glowing Mentor Suggestion */}
            <div className="mt-8 bg-gradient-to-r from-black to-[#4F86C6]/10 border border-[#4F86C6]/30 rounded-xl p-4 flex justify-between items-center group-hover:border-[#4F86C6]/60 transition-colors">
              <div>
                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-1">Recommended Mentor</p>
                <p className="text-xs font-bold text-white">Sarah W. - Ex-Meta</p>
              </div>
              <button className="text-[10px] text-[#4F86C6] font-black uppercase hover:underline">Connect →</button>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER INTEGRATION */}
      <div className="mt-auto border-t border-white/5 bg-[#0A0A0A]">
        <Footer />
      </div>
    </section>
  );
}
