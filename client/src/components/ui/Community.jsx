import image6 from "../../assets/image6.png";
import img from "../../assets/imag.png";

export default function Community() {
  return (
    <section className="w-full min-h-screen bg-[#0A0A0A] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-8 py-20 border-t border-white/5 relative overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#4F86C6]/5 blur-[120px] rounded-full -translate-y-1/2 -mr-40"></div>

      {/* LEFT: CONTENT SECTION */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8 relative z-10">
        <header className="space-y-4">
          <h2 className="font-rose text-5xl md:text-7xl lg:text-8xl text-[#4F86C6] tracking-tighter uppercase leading-[0.9]">
            Tech Communities
          </h2>
          <div className="space-y-1">
            <p className="font-rose text-3xl md:text-4xl lg:text-5xl text-white">
              <span className="text-[#FF7849] font-black italic">Code</span>{" "}
              Together.
            </p>
            <p className="font-rose text-2xl md:text-3xl lg:text-4xl text-[#868686]">
              <span className="text-[#4F86C6] font-black italic text-3xl md:text-5xl">
                Ship
              </span>{" "}
              Faster.
            </p>
          </div>
        </header>

        <div className="space-y-6 max-w-lg">
          <p className="text-lg md:text-xl text-gray-400 font-mono leading-relaxed">
            Join tech communities and cohorts. Surround yourself with builders, share resources, and grow organically.
          </p>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl transition-all hover:border-[#FF7849]/30">
              <p className="font-mono text-xs uppercase tracking-widest text-[#FF7849] font-black mb-2">
                Live Collaborative Sessions
              </p>
              <p className="text-[10px] text-gray-500 uppercase leading-relaxed font-bold">
                Real-time sessions with resource sharing, notes, and recordings.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl transition-all hover:border-[#4F86C6]/30">
              <p className="font-mono text-xs uppercase tracking-widest text-[#4F86C6] font-black mb-2">
                Peer Discussions
              </p>
              <p className="text-[10px] text-gray-500 uppercase leading-relaxed font-bold">
                Chat-based tech communities and cohorts to learn together.
              </p>
            </div>
          </div>

          <p className="text-lg md:text-xl font-mono text-white/80 leading-relaxed pt-4 border-t border-white/5">
            Experience the purest form of{" "}
            <span className="text-[#4F86C6] font-bold">developer</span>{" "}
            <span className="text-[#FF7849] font-bold">collaboration</span>.
          </p>
        </div>
      </div>

      {/* RIGHT: VISUAL IMAGE SECTION */}
      <div className="w-full lg:w-1/3 max-w-md relative group">
        <div className="absolute inset-0 bg-[#4F86C6]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative bg-[#161616] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02]">
          {/* Desktop Image */}
          <img
            src={image6}
            alt="UpSkillr Community"
            className="w-full h-auto object-cover hidden lg:block opacity-80 group-hover:opacity-100 transition-opacity" />
          
          {/* Mobile Image */}
          <img
            src={img}
            alt="UpSkillr Community Mobile"
            className="w-full h-72 object-cover lg:hidden opacity-80" />
          

          {/* Glassmorphism Overlay */}
          <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
            <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest text-center">
              Active Developer Community
            </p>
          </div>
        </div>
      </div>
    </section>);

}