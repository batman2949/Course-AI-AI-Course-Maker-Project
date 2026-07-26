import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { NewCourse } from "./newCourseButton";
import { UserCourse } from "./userCourse";

export default function Dashboard() {
  return (
    <div className="w-full bg-gradient-to-b from-blue-50/60 via-white to-slate-50 min-h-screen text-slate-800">

      {/* Main Content Header */}
      <div className="sticky top-0 z-40 flex px-8 py-5 items-center justify-between bg-white/80 backdrop-blur-md border-b border-blue-100/80 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage and explore your AI-generated learning paths</p>
        </div>
        <div className="scale-110">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "shadow-sm ring-2 ring-blue-500 scale-125 hover:ring-blue-500/40 transition",
              },
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        <NewCourse />

        <details open className="bg-gradient-to-br from:bg-white to-bg-blue-100 border border-blue-100/80 rounded-2xl p-6 shadow-sm shadow-blue-400/45 transition-all">
          <summary className="text-xl md:text-2xl font-bold cursor-pointer text-slate-900 mb-6 flex items-center justify-between select-none border-b border-slate-100 pb-4 transition">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-600 inline-block" />
              Your Courses
            </span>
            <span className="text-xs text-slate-400 font-normal">Click to toggle</span>
          </summary>
          <div >
            <UserCourse />
          </div>
        </details>   
      </div>

    </div>
  );
}