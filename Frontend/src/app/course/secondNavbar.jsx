"use client";
import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export function SecondNavbar() {
  const [isHomeLoading, setIsHomeLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const handleHomeClick = () => {
    setIsHomeLoading(true);
    setIsCreateLoading(false);
  };

  const handleCreateClick = () => {
    setIsCreateLoading(true);
    setIsHomeLoading(false);
  };

  const isAnyLoading = isHomeLoading || isCreateLoading;

  return (
    <div
      className={`flex sticky top-0 z-50 items-center justify-end p-1 gap-6 bg-white shadow-sm transition-all duration-200 ${
        isAnyLoading ? "pointer-events-none" : ""
      }`}
    >
      <Link
        href="/dashboard"
        onClick={handleHomeClick}
        className={`text-md font-bold tracking-wide hover:underline hover:decoration-2 transition-all duration-200 ${
          isHomeLoading
            ? "text-black"
            : "text-gray-700 hover:text-blue-600"
        }`}
      >
        {isHomeLoading ? "Loading…" : "Home"}
      </Link>

      <Link
        href="/dashboard/dashboardform"
        onClick={handleCreateClick}
        className={`text-md font-bold tracking-wide hover:underline hover:decoration-2 transition-all duration-200 ${
          isCreateLoading
            ? "text-black"
            : "text-gray-700 hover:text-purple-600"
        }`}
      >
        {isCreateLoading ? "Loading…" : "Create New Course"}
      </Link>

      <div className="scale-110 mr-2 p-0.5">
        <UserButton />
      </div>
    </div>
  );
}
