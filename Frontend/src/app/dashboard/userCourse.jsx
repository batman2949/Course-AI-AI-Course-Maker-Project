'use client';

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function UserCourse() {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickLoading, setClickLoading] = useState(false); // if you click study this close it will become active
  const { isLoaded, isSignedIn, getToken } = useAuth();
  
  const router = useRouter();
  

  const userCourseData = async () => {
    const token = await getToken();

    console.log({isLoaded, isSignedIn,token});
    
    if(token == null || isSignedIn == false){ 
      router.push("/sign-in");
    }

    setLoading(true);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/course/getCourses`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    console.log(data);
    setCourse(data.courseData);
    console.log("✅ Course Data:", data.courseData);
    setLoading(false);
  };

  useEffect(() => {
    userCourseData();
  }, []);

  const handleCourseClick = async (element) => {

    setClickLoading(true); // show black screen loader
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/userHistory/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: element._id })
      });

      if (response.ok) {
        toast.success("Loading...");
      }

      router.push(`/c/${element._id}`);
    } catch (err) {
      console.error("Error updating progress:", err);
      toast.error("Failed to update progress");
      setLoading(false);
    }
  };

  return (
    <div className="p-1 relative">

      {loading ? (
        // Initial Spinner Loader
        <div className="flex justify-center items-center h-48">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-start">
          
      {/* Click Loader */}
      {clickLoading && (
        <div className="fixed inset-0 z-50 flex flex-col gap-3 justify-center items-center bg-slate-900/40 backdrop-blur-xs transition-all">
          <div className="w-12 h-12 border-4 border-white border-t-blue-600 rounded-full animate-spin shadow-lg"></div>
          <span className="text-sm font-semibold text-white tracking-wide">Opening Course...</span>
        </div>
      )}
          {course.length > 0 ? (
            course.map((element) => (
              <div
                key={element._id}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl  hover:scale-105 hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 cursor-pointer flex flex-col group overflow-hidden"
                onClick={() => handleCourseClick(element)}
              >
                {/* Card Content */}
                <div className="p-6 flex-1 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {element.chapters.length} {element.chapters.length === 1 ? 'Chapter' : 'Chapters'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(element.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-blue-600 transition-colors truncate mb-2">
                    {element.title}
                  </h3>
                  
                  <div className="space-y-1 text-xs text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-700">Topic:</span> {element.topic}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-900 to-blue-800 text-white font-semibold text-xs text-center py-3.5 px-4 transition-colors duration-200 flex items-center justify-center gap-1.5 border-t border-slate-100">
                  <span>Study Now</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-500 text-sm font-medium">
                No courses found. Click above to create your first course!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}