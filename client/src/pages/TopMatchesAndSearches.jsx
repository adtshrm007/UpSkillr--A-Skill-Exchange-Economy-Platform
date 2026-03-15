import { useEffect, useState } from "react";
// import Card from "./Card";
import NavBar from "../components/common/Navbar";

import { Link, useLocation } from "react-router-dom";
import React from "react";

export default function TopMatchesAndSearches() {
  const [matches, setMatches] = useState([]);
  const location = useLocation();

  //   useEffect(() => {
  //     async function showMatches() {
  //       const res = await getTopMatches(); //
  //       setMatches(res?.matches || []);
  //     }
  //     showMatches();
  //   }, []);

  return (
    <div className="bg-[#0A0A0A] min-h-screen w-full flex flex-col lg:flex-row font-mono text-gray-100 overflow-x-hidden">
      {/* CENTERING FLOATING SIDEBAR */}
      <NavBar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-12 lg:pl-36 lg:pb-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* HEADER SECTION */}
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-black tracking-tight uppercase">
                Discover <span className="text-[#4F86C6]">Partners</span>
              </h2>
              <Link
                to="/dashboard"
                className="text-xs uppercase tracking-widest text-[#FF7849] hover:underline font-bold"
              >
                ← Dashboard
              </Link>
            </div>

            {/* SEARCH BAR REDESIGN */}
            <div className="relative group w-full lg:max-w-3xl">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 640 640">
                  <path
                    fill="currentColor"
                    d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for skills (e.g. React, Python, UI Design)..."
                className="w-full bg-[#161616] border border-white/10 rounded-[24px] py-5 pl-14 pr-6 text-sm outline-none focus:border-[#4F86C6]/50 focus:shadow-[0_0_30px_rgba(79,134,198,0.1)] transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* MATCHES GRID */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {matches.length === 0 ?
            <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-[40px]">
                <p className="text-gray-500 italic uppercase text-xs tracking-widest">
                  Identifying potential matches...
                </p>
              </div> :

            matches.map((i) => {
              // Logic preserved for match calculation
              const theyOffer = i.matchedSkills.map((s) =>
              s.skillOffered.toLowerCase()
              );
              const theyWant = i.learningSkills.map((s) =>
              s.skillToLearn.toLowerCase()
              );
              const match1 = theyOffer.filter((s) =>
              theyWant.includes(s)
              ).length;
              const total = theyOffer.length + theyWant.length;
              const matchPercent =
              total === 0 ? 0 : Math.round(match1 * 2 / total * 100);

              return (
                <div
                  key={i._id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                    <Card
                    _id={i._id}
                    name={i.name}
                    email={i.email}
                    match={matchPercent.toString()}
                    skillsOffered={i.matchedSkills}
                    skillsRequested={i.learningSkills} />
                  
                  </div>);

            })
            }
          </div> */}
        </div>
      </main>
    </div>
  );
}
