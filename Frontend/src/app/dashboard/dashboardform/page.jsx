"use client";

import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { GeminiObject } from "../../useContext";
import { useRouter } from "next/navigation";
import ChapterListSkeleton from "./courseLoader";

export default function CreateCourseForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [step, setStep] = useState(1);
  const [width, setWidth] = useState(0);
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const{geminiResponse, setGetminiResponse, geminiResponseArray, setGetminiResponseArray} = useContext(GeminiObject);

  const router = useRouter();

  useEffect(() => {
    const stepWidth = (step / 3) * 100;
    setWidth(stepWidth);
  }, [step]);

  const onSubmit = async (data) => {
  try {
    console.log("✅ Final Course Data:", data);
    setLoading(true); // Show loading overlay

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });

    const finalData = await response.json();
    console.log("Raw Gemini response:", finalData.course);

    // ✅ Clean the text
    const cleanedText = finalData.course
      .replace(/```json/g, "") // remove ```json
      .replace(/```/g, "")     // remove ```
      .trim();                 // remove extra whitespace/newlines

    // ✅ Parse safely
    let courseObj;
    try {
      courseObj = JSON.parse(cleanedText);
    } catch (err) {
      console.error("❌ Failed to parse cleaned JSON:", err);
      alert("Gemini returned invalid JSON. Try again.");
      setLoading(false);
      return;
    }

    // ✅ Set state
    setGetminiResponse(courseObj);
    setGetminiResponseArray(courseObj.chapters);

    localStorage.removeItem("geminiResponse");


    // setLoading(false);
    router.push("/dashboard/chapters");

  } catch (err) {
    console.error(err);           
    setLoading(false);
    alert("❌ Error, Try Again");
  } 
};


  return (
    <div>
      {/* ✅ Loading Overlay */}
      {loading ? <ChapterListSkeleton/>:
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4 relative">
      

      {/* Premium Progress Bar */}
      <div className="w-full max-w-lg mb-6 h-4 rounded-full bg-gray-300 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-br from-blue-500 via-blue-700 to-blue-900 transition-all duration-700 ease-in-out"
          style={{
            width: `${width}%`,
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.6)",
          }}
        ></div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col text-gray-900 bg-white shadow-2xl p-6 rounded-2xl w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create a Course
        </h1>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="font-semibold">Course Category</label>
            <select
              {...register("category", { required: "Please select a category" })}
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition"
              defaultValue=""
            >
              <option value="" disabled>Select a category</option>
              <option value="PCM">PCM</option>
              <option value="Computers">Computers</option>
              <option value="Psychology">Psychology</option>
              <option value="Yoga">Yoga</option>
              <option value="Biology">Biology</option>
              <option value="Commerce">Commerce</option>
              <option value="Humanities">Humanities</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-900 cursor-pointer text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Next →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="font-semibold">Course Title</label>
            <input
              {...register("title", { required: "Course title is required" })}
              placeholder="e.g. Mastering Java"
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

            <label className="font-semibold">Course Topic</label>
            <input
              {...register("topic", { required: "Course topic is required" })}
              placeholder="e.g. OOP, Data Structures, etc."
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {errors.topic && <p className="text-red-500 text-sm">{errors.topic.message}</p>}

            <label className="font-semibold">Additional Details (Optional)</label>
            <textarea
              {...register("additionalDetails")}
              placeholder="Explain what students will learn..."
              className="border p-2 rounded-md w-full min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-medium py-2 px-4 rounded-md transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-900 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
          <label className="font-semibold mt-4 block">Number of Chapters</label>
<input
  type="number"
  {...register("chapters", {
    required: "Please enter number of chapters",
    min: { value: 1, message: "Must have at least 1 chapter" },
    max: { value: 15, message: "Maximum allowed chapters is 15" },
  })}
  className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  placeholder="Enter number of chapters"
/>
{errors.chapters && <p className="text-red-500 text-sm">{errors.chapters.message}</p>}


            <label className="font-semibold">Course Level</label>
            <select
              {...register("level", { required: "Please select a level" })}
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              defaultValue=""
            >
              <option value="" disabled>Select level</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.level && <p className="text-red-500 text-sm">{errors.level.message}</p>}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 font-medium py-2 px-4 rounded-md transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-700 to-purple-600 hover:from-pink-800 hover:to-purple-800 cursor-pointer text-white font-semibold py-2 px-4 rounded-md transition"
              >
                Generate Course
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
    }
    </div>
  );
}
