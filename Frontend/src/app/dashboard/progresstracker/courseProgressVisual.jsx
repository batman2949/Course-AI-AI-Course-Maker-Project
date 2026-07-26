import { useEffect, useState } from "react";

export function CourseProgress({ course }) {
  const completed = course.completedChapters.length;
  const total = course.totalHeadings;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Trigger animation after mount
    const timeout = setTimeout(() => setProgress(percentage), 100); // small delay
    return () => clearTimeout(timeout);
  }, [percentage]);

  return (
    <div className="w-full max-w-sm p-4 bg-gray-50 shadow-md rounded">
      <div className="flex justify-between mb-2">
        <span className="font-medium text-gray-700">Course Progress</span>
        <span className="font-bold text-indigo-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-300 h-4 rounded-full overflow-hidden">
        <div
          className="bg-indigo-700 h-4 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
