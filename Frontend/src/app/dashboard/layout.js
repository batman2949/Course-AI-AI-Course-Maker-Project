"use client";

import Navbar from "./navbar";


export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Navbar/>

      {/* Main Content */}
      <main  className="flex-1 p-0 ml-59 ">
        {children} {/* All pages under /dashboard will render here */}
      </main>
    </div>
  );
}
