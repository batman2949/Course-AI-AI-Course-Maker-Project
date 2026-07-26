import UserProfile from "./profile";
import Link from "next/link";

export default function User() {
  return (
    <div className="bg-gradient-to-b from-blue-50/60 via-white to-slate-50 min-h-screen p-6 md:p-10 text-slate-800">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-200/80">
          <div>
            <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
              Account Settings
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              User Profile
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Manage your personal information, security, and account preferences.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:border-slate-300 active:scale-95"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Profile Card Container */}
        <div className="flex justify-center rounded-2xl border border-blue-100/80 bg-white p-6 shadow-xl shadow-blue-500/5">
          <UserProfile />
        </div>

        {/* Footer Support Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <a  className="transition hover:text-blue-600">
            Need Help?
          </a>
          <span>•</span>
          <a className="transition hover:text-blue-600">
            Privacy Policy
          </a>
          <span>•</span>
          <a  className="transition hover:text-blue-600">
            Terms of Service
          </a>
        </div>

      </div>
    </div>
  );
}