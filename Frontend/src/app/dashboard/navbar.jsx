import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { HomeSharp } from "../svg/home";
import { Search } from "../svg/search";
import { HamburgerLg } from "../svg/hamburger";
import { GraphBarIncreaseSolid } from "./graph";
import { User3Fill } from "./usersvg";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const paths = [
    { name: "Home", path: "/dashboard", emoji: <HomeSharp /> },
    { name: "Explore", path: "/dashboard/explore", emoji: <Search /> },
    { name: "Progress Tracker", path: "/dashboard/progresstracker", emoji: <GraphBarIncreaseSolid/> },
    { name: "User Profile", path: "/dashboard/userprofile", emoji: <User3Fill/> },
  ];

  return (
    <div>
      {/* Hamburger for mobile */}
      <span
        className="absolute z-50 text-3xl sm:hidden cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <HamburgerLg />
      </span>

      <div
        className={`fixed top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 shadow-md p-5
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center justify-center mb-7">
          <h1
            className="text-3xl text-blue-700 font-extrabold text-center sm:block"
          >
            AI Course Maker
          </h1>
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center mb-10">
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-3 relative">
          {paths.map((element, index) => {
            const isActive = pathname === element.path;
            return (
              <Link
                key={index}
                href={element.path}
                prefetch={true}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold transition-all duration-150 shadow-sm
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gradient-to-r select-none hover:from-blue-500 hover:to-indigo-500 hover:text-white"
                  }`}
              >
                <span className="text-lg">{element.emoji}</span>
                <span className="sm:inline">{element.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="absolute bottom-5 text-center text-xs text-gray-400"
        >
          © 2026 AI Course Maker
        </div>
      </div>
    </div>
  );
}
