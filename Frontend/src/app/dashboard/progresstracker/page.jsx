import { UserProgress } from "./userProgressTracker";

export default function ProgressTracker() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-slate-50 py-10 px-6 text-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
            Analytics & Stats
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Your Learning Journey
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Track your course completions, milestones, and active progress.
          </p>
        </div>

        <UserProgress />
      </div>
    </div>
  );
}