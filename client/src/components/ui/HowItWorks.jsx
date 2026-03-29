import HeroImage1 from "../../assets/HeroImage1.png";
import image from "../../assets/Image.png";

export default function HowItWorks() {
  return (
    <section className="w-full min-h-screen bg-[#0A0A0A] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24 px-8 py-20 border-t border-white/5 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#4F86C6]/5 blur-[120px] rounded-full -translate-y-1/2 -ml-32"></div>

      {/* LEFT: VISUAL IMAGE SECTION */}
      <div className="w-full lg:w-1/3 max-w-md relative group">
        <div className="absolute inset-0 bg-[#FF7849]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative bg-[#161616] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-2">
          {/* Desktop Image */}
          <img
            src={HeroImage1}
            alt="Skill Exchange illustration"
            className="w-full h-auto object-cover hidden lg:block opacity-90 group-hover:opacity-100 transition-opacity" />
          
          {/* Mobile Image */}
          <img
            src={image}
            alt="Skill Exchange illustration mobile"
            className="w-full h-64 object-cover lg:hidden opacity-90" />
          
        </div>
      </div>

      {/* RIGHT: CONTENT SECTION */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8 relative z-10">
        <header className="space-y-4">
          <h2 className="font-rose text-5xl md:text-7xl lg:text-8xl text-white tracking-tighter uppercase leading-[0.9]">
            <span className="text-[#4F86C6]">How</span> <br /> It Works
          </h2>
          <div className="space-y-1">
            <p className="font-rose text-2xl md:text-3xl lg:text-4xl text-white">
              <span className="text-[#FF7849] font-black italic">
                Monetize
              </span>{" "}
              Your Expertise.
            </p>
            <p className="font-rose text-xl md:text-2xl lg:text-3xl text-[#868686]">
              <span className="text-[#4F86C6] font-black italic">
                Learn Anything.
              </span>{" "}
              Zero Cost.
            </p>
          </div>
        </header>

        <div className="space-y-6 max-w-lg">
          <p className="text-lg md:text-xl text-gray-400 font-mono leading-relaxed">
            UpSkillr is built for developers by developers. Here is how you learn, teach, and grow:
          </p>

          <div className="space-y-4">
            {/* Flow 1 */}
            <div className="bg-white/5 border-l-2 border-[#4F86C6] p-4 rounded-r-2xl">
              <h3 className="text-[#4F86C6] font-black uppercase text-xs tracking-widest mb-1">1. Skill Swap</h3>
              <p className="text-sm text-gray-300 font-mono">
                Peer-to-peer tech learning. Learn one skill while teaching another.
              </p>
            </div>
            {/* Flow 2 */}
            <div className="bg-white/5 border-l-2 border-[#FF7849] p-4 rounded-r-2xl">
              <h3 className="text-[#FF7849] font-black uppercase text-xs tracking-widest mb-1">2. Mentorship</h3>
              <p className="text-sm text-gray-300 font-mono">
                Learn from experienced developers. Credit-based sessions.
              </p>
            </div>
            {/* Flow 3 */}
            <div className="bg-white/5 border-l-2 border-white/20 p-4 rounded-r-2xl">
              <h3 className="text-white font-black uppercase text-xs tracking-widest mb-1">3. Communities</h3>
              <p className="text-sm text-gray-300 font-mono">
                Join or build tech learning communities. Live sessions, discussions, shared resources.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Link (Optional) */}
        <div className="pt-6">
          <button className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-black hover:text-[#FF7849] transition-colors">
            Explore the Protocol →
          </button>
        </div>
      </div>
    </section>);

}