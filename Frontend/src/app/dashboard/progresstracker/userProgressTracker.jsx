"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CourseProgress } from "./courseProgressVisual";
import { useRouter } from "next/navigation";

export function UserProgress() {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState([]);

  const router = useRouter();

  async function userProgress() {
    try {
      const token = await getToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getHistoryProgress`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        throw new Error("Failed to fetch user progress");
      }
    } catch (err) {
      console.error("Error fetching user progress:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    userProgress();
  }, []);

  const handleToggle = (e, courseId) => {
    e.preventDefault();
    setClicked((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center text-xl font-semibold text-gray-500">
        Fetching your progress...
      </div>
    );

  return (
    <div className="px-6 py-8">
      {courses.length === 0 ? (
        <div className="py-16 text-center text-lg text-gray-500">
          No courses visited yet. Time to explore! 🚀
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {courses.map((course) => (
            <div
              key={course.courseId}
              className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <div>
                <h2
                  className="mb-2 cursor-pointer text-center text-3xl font-bold text-slate-800 transition-colors hover:text-indigo-600"
                  onClick={() => {
                    router.push(`/c/${course.courseId}`);
                  }}
                >
                  {course.courseTitle}
                </h2>

                <p className="mb-8 text-center italic text-gray-500">
                  {course.courseTopic}
                </p>

                <div className="mb-6 flex flex-col gap-2 text-sm text-gray-600">
                  <p>
                    Total Chapters:{" "}
                    <span className="font-semibold text-slate-800">
                      {course.totalChapters}
                    </span>
                  </p>

                  <p>
                    Total Headings:{" "}
                    <span className="font-semibold text-slate-800">
                      {course.totalHeadings}
                    </span>
                  </p>
                </div>

                {/* Progress Graph */}
                <details
                  open={clicked.includes(course.courseId)}
                  className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4"
                >
                  <summary
                    className="cursor-pointer font-semibold text-indigo-700 hover:text-indigo-800"
                    onClick={(e) => handleToggle(e, course.courseId)}
                  >
                    📊 View Progress Graph
                  </summary>

                  {clicked.includes(course.courseId) && (
                    <div className="mt-4 rounded-xl border border-indigo-100 bg-white p-4">
                      <CourseProgress
                        key={course.courseId + "-graph"}
                        course={course}
                      />
                    </div>
                  )}
                </details>

                {/* Completed Chapters */}
                <details className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-4">
                  <summary className="cursor-pointer font-semibold text-green-700 hover:text-green-800">
                    ✅ Completed Chapters:{" "}
                    {course.completedChapters.length}
                  </summary>

                  <div className="mt-3 space-y-2 pl-2 text-gray-700">
                    {course.completedChapters.map((chapter, index) => (
                      <div key={index}>
                        <span className="mr-2">📌</span>
                        {chapter}
                      </div>
                    ))}
                  </div>
                </details>

                {/* Important Chapters */}
                <details className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4">
                  <summary className="cursor-pointer font-semibold text-red-700 hover:text-red-800">
                    ⭐ Important Chapters:{" "}
                    {course.importantChapters.length}
                  </summary>

                  <div className="mt-3 space-y-2 pl-2 text-gray-700">
                    {course.importantChapters.map((chapter, index) => (
                      <div key={index}>
                        <span className="mr-2">📌</span>
                        {chapter}
                      </div>
                    ))}
                  </div>
                </details>
              </div>

              <p className="mt-8 border-t border-gray-200 pt-5 text-sm text-gray-500">
                Last Opened:{" "}
                <span className="font-medium text-slate-700">
                  {new Date(course.lastAccessed).toLocaleString()}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}