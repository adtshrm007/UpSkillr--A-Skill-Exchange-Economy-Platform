import logo from "../../assets/Logo.png";
import React from "react";
import { Link } from "react-router-dom";
export default function NavBar() {
  const NavItem = ({ to, iconColor, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
          isActive
            ? `bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]`
            : "opacity-40 hover:opacity-100"
        }`}
      >
        {React.cloneElement(children, {
          fill: isActive ? iconColor : "#FFFFFF",
          className: `w-6 h-6 transition-all ${isActive ? "drop-shadow-[0_0_8px_" + iconColor + "]" : ""}`,
        })}
      </Link>
    );
  };
  return (
    <>
      <div>
        <nav
          className="fixed bottom-0 w-full bg-[#121212]/90 backdrop-blur-xl border-t border-white/5 p-4 flex justify-around items-center z-50 
        lg:fixed lg:left-8 lg:top-1/2 lg:-translate-y-1/2 lg:w-20 lg:h-fit lg:flex-col lg:bg-[#161616] lg:border lg:border-white/10 lg:rounded-[40px] lg:py-10 lg:gap-12 lg:shadow-2xl"
        >
          <div className="hidden lg:block w-10 h-10 mb-4 animate-pulse">
            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex lg:flex-col gap-10 items-center">
            <NavItem to="/dashboard" iconColor="#FF7849">
              <svg viewBox="0 0 640 640">
                <path d="M96 96C113.7 96 128 110.3 128 128L128 464C128 472.8 135.2 480 144 480L544 480C561.7 480 576 494.3 576 512C576 529.7 561.7 544 544 544L144 544C99.8 544 64 508.2 64 464L64 128C64 110.3 78.3 96 96 96zM192 160C192 142.3 206.3 128 224 128L416 128C433.7 128 448 142.3 448 160C448 177.7 433.7 192 416 192L224 192C206.3 192 192 177.7 192 160zM224 240L352 240C369.7 240 384 254.3 384 272C384 289.7 369.7 304 352 304L224 304C206.3 304 192 289.7 192 272C192 254.3 206.3 240 224 240zM224 352L480 352C497.7 352 512 366.3 512 384C512 401.7 497.7 416 480 416L224 416C206.3 416 192 401.7 192 384C192 366.3 206.3 352 224 352z" />
              </svg>
            </NavItem>
            <NavItem to="/courses" iconColor="#4F86C6">
              <svg viewBox="0 0 640 640">
                <path d="M160 96C160 78.3 174.3 64 192 64L448 64C465.7 64 480 78.3 480 96L480 416L160 416L160 96zM192 128L192 384L448 384L448 128L192 128zM96 192C96 174.3 110.3 160 128 160L128 448L384 448C401.7 448 416 462.3 416 480C416 497.7 401.7 512 384 512L128 512C110.3 512 96 497.7 96 480L96 192zM256 192L384 192L384 224L256 224L256 192zM256 256L352 256L352 288L256 288L256 256z" />
              </svg>
            </NavItem>
            <NavItem to="/TopMatchesAndSearches" iconColor="#4F86C6">
              <svg viewBox="0 0 640 640">
                <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
              </svg>
            </NavItem>
            <NavItem to="/requests" iconColor="#FFFFFF">
              <svg viewBox="0 0 640 640">
                <path d="M267.7 576.9C267.7 576.9 267.7 576.9 267.7 576.9L229.9 603.6C222.6 608.8 213 609.4 205 605.3C197 601.2 192 593 192 584L192 512L160 512C107 512 64 469 64 416L64 192C64 139 107 96 160 96L480 96C533 96 576 139 576 192L576 416C576 469 533 512 480 512L359.6 512L267.7 576.9zM332 472.8C340.1 467.1 349.8 464 359.7 464L480 464C506.5 464 528 442.5 528 416L528 192C528 165.5 506.5 144 480 144L160 144C133.5 144 112 165.5 112 192L112 416C112 442.5 133.5 464 160 464L216 464C226.4 464 235.3 470.6 238.6 479.9C239.5 482.4 240 485.1 240 488L240 537.7C272.7 514.6 303.3 493 331.9 472.8z" />
              </svg>
            </NavItem>
            <NavItem to="/analytics" iconColor="#FF7849">
              <svg viewBox="0 0 640 640">
                <path d="M160 448L160 160C160 142.3 174.3 128 192 128C209.7 128 224 142.3 224 160L224 448C224 465.7 209.7 480 192 480C174.3 480 160 465.7 160 448zM288 448L288 256C288 238.3 302.3 224 320 224C337.7 224 352 238.3 352 256L352 448C352 465.7 337.7 480 320 480C302.3 480 288 465.7 288 448zM416 448L416 352C416 334.3 430.3 320 448 320C465.7 320 480 334.3 480 352L480 448C480 465.7 465.7 480 448 480C430.3 480 416 465.7 416 448z" />
              </svg>
            </NavItem>
            <NavItem to="/profile" iconColor="#4F86C6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path
                  fill="#ffffff"
                  d="M470.5 463.6C451.4 416.9 405.5 384 352 384L288 384C234.5 384 188.6 416.9 169.5 463.6C133.9 426.3 112 375.7 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320C528 375.7 506.1 426.2 470.5 463.6zM430.4 496.3C398.4 516.4 360.6 528 320 528C279.4 528 241.6 516.4 209.5 496.3C216.8 459.6 249.2 432 288 432L352 432C390.8 432 423.2 459.6 430.5 496.3zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM320 304C297.9 304 280 286.1 280 264C280 241.9 297.9 224 320 224C342.1 224 360 241.9 360 264C360 286.1 342.1 304 320 304zM232 264C232 312.6 271.4 352 320 352C368.6 352 408 312.6 408 264C408 215.4 368.6 176 320 176C271.4 176 232 215.4 232 264z"
                />
              </svg>
            </NavItem>
          </div>
        </nav>
      </div>
    </>
  );
}
