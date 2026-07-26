'use client';

import { useUser, useAuth } from "@clerk/nextjs";
import { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function UserProfile() {
  const { user } = useUser();
  const { signOut } = useAuth(); // correct hook for signing out
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  if (!user) return (
    <div className="text-center w-full flex justify-center my-6">
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
        <div className="bg-white shadow-xl shadow-blue-500/5 border border-blue-100/80 rounded-2xl p-6 w-full max-w-sm mx-auto flex flex-col items-center">
          {/* Avatar */}
          <Skeleton circle width={96} height={96} className="mb-4" />
          {/* Name */}
          <Skeleton width={150} height={24} className="mb-2" />
          {/* Email */}
          <Skeleton width={200} height={16} className="mb-4" />
          {/* Logout button */}
          <Skeleton width={100} height={36} className="rounded-xl" />
        </div>
      </SkeletonTheme>
    </div>
  );

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setShowLogoutPopup(true);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowLogoutPopup(false);
  };

  const handleConfirmLogout = async () => {
    await signOut(); // actually logs the user out
  };

  return (
    <div className="relative w-full flex justify-center">
      <div className="bg-white border border-blue-100/80 shadow-xl shadow-blue-500/5 rounded-2xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 p-8 w-full max-w-sm sm:max-w-md mx-auto">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="w-24 h-24 rounded-full shadow-md mb-4 ring-4 ring-blue-50/80 border border-slate-100 object-cover"
          />
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {user.fullName || "No Name Provided"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        <div className="flex justify-center border-t border-slate-100 pt-6">
          <button
            onClick={handleLogoutClick}
            className="w-full bg-rose-50 text-rose-600 border border-rose-200/80 hover:bg-rose-600 hover:text-white px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide cursor-pointer transition-all duration-200 active:scale-95 shadow-2xs"
          >
            Sign Out of Account
          </button>
        </div>
      </div> 

      {showLogoutPopup && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50 p-4 transition-all"
          onClick={() => setShowLogoutPopup(false)} // close when clicking outside
        >
          <div
            className="bg-white rounded-2xl border border-slate-100 p-6 w-full max-w-xs shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h3 className="text-base font-bold text-slate-900 mb-2">Sign Out</h3>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to log out of your CourseAI workspace?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer bg-slate-100 text-slate-700 hover:bg-slate-200 transition active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 transition active:scale-95"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}