"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Allcourse() {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickLoading, setClickLoading] = useState(false);

  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();

  const getAllCourses = async () => {
    if (!isLoaded) return;

    try {
      const token = await getToken();

      if (!token || !isSignedIn) {
        router.push("/sign-in");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/course/getallCourses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();

      setCourse(data.courseData);
      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load courses");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, [isLoaded]);

  const handleCourseClick = async (element) => {
    try {
      setClickLoading(true);

      const token = await getToken();

      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/userHistory/progress`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: element._id,
          }),
        }
      );

      toast.success("Loading...");
      router.push(`/c/${element._id}`);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
      setClickLoading(false);
    }
  };

  return (
    <div className="p-3 ">

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center">
          {clickLoading && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
              <div className="w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {course.length > 0 ? (
            course.map((element) => (
              <div
                key={element._id}
                onClick={() => handleCourseClick(element)}
                className="w-full sm:w-[45%] lg:w-[30%] bg-white hover:bg-blue-50 border border-blue-200 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer flex flex-col"
              >
                <div className="p-6 flex-1 bg-b-50">
                  <h3 className="text-lg md:text-xl font-bold text-blue-500 truncate text-center mb-3">
                    {element.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold text-blue-400">
                      Topic:
                    </span>{" "}
                    {element.topic}
                  </p>

                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold text-blue-400">
                      Chapters:
                    </span>{" "}
                    {element.chapters.length}
                  </p>

                  <p className="text-xs text-gray-500 mt-4">
                    Created At:{" "}
                    {new Date(element.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-semibold text-center py-3 rounded-b-2xl">
                  Explore Course
                </div>
              </div>
            ))
          ) : (
            <p className=" text-gray-500 text-sm">
              No courses from other users are available right now.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Allcourse;