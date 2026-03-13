import Footer from "./Footer";
import image7 from "../../assets/Image7.png";
import img from "../../assets/img.png";

export default function FollowOurNews() {
  return (
    <section className="w-full min-h-screen bg-[#0A0A0A] flex flex-col font-mono text-white relative overflow-hidden border-t border-white/5">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-[20%] left-[-5%] w-72 h-72 bg-[#FF7849]/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-8 py-20 z-10">
        
        {/* LEFT: TEXT & FORM SECTION */}
        <div className="w-full lg:w-1/2 max-w-xl space-y-10">
          <header className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
              Follow <br /> 
              <span className="text-[#FF7849] drop-shadow-[0_0_15px_rgba(255,120,73,0.3)]">Our News</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md">
              Stay in the loop with the latest protocol updates, community stories, 
              and exclusive skill-swapping promotions.
            </p>
          </header>

          {/* MODERN INPUT GROUP */}
          <div className="relative group w-full max-w-md">
            <div className="flex items-center bg-[#161616] border border-white/10 rounded-2xl p-2 pl-6 transition-all focus-within:border-[#FF7849]/50 focus-within:shadow-[0_0_20px_rgba(255,120,73,0.1)]">
              <input
                type="email"
                placeholder="email@example.com"
                className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-300 placeholder:text-gray-700" />
              
              <button className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF7849] hover:text-black transition-all duration-300 active:scale-95">
                Subscribe
              </button>
            </div>
            <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-3 ml-2 font-bold italic">
              * Join 2,000+ Swappers already in the loop.
            </p>
          </div>
        </div>

        {/* RIGHT: VISUAL IMAGE SECTION */}
        <div className="w-full lg:w-1/3 max-w-sm relative group">
          <div className="absolute inset-0 bg-[#FF7849]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative bg-[#161616] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 hover:rotate-2">
            {/* Desktop Image */}
            <img
              src={image7}
              alt="UpSkillr News"
              className="w-full h-auto object-cover hidden lg:block opacity-90 group-hover:opacity-100 transition-opacity" />
            
            {/* Mobile Image */}
            <img
              src={img}
              alt="UpSkillr News Mobile"
              className="w-full h-72 object-cover lg:hidden opacity-80" />
            
          </div>
        </div>
      </div>

      {/* FOOTER INTEGRATION */}
      <div className="mt-auto border-t border-white/5 bg-[#0A0A0A]">
        <Footer />
      </div>
    </section>);

}