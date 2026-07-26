'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NewCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push("/dashboard/dashboardform");
  };

  return (
    <div className="mt-6 flex justify-center">
      <div
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                   shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 
                   hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 transition-all duration-200 
                   font-semibold cursor-pointer size-max px-6 py-3.5 text-base text-white 
                   rounded-xl flex items-center gap-2.5 border border-blue-500/30 select-none"
        onClick={handleClick}
      >

        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent 
                          rounded-full animate-spin"></div>
        ) : (
          <span className="text-lg leading-none">✨</span>
        )}

        <span>{loading ? "Opening Builder..." : "Create a New AI Course"}</span>
      </div>
    </div>
  );
}