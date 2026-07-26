"use client";

import { useContext } from "react";
import { GeminiObject } from "../useContext";

export default function Sidebar({ title, topic, chapters }) {
  const { geminiResultArray } = useContext(GeminiObject);

  // Use passed props or fall back to context data
  const courseTitle = title || "Course";
  const courseTopic = topic || "Overview";
  const chapterList = chapters?.length ? chapters : geminiResultArray;

  return (
    <aside className="hidden md:flex flex-col sticky top-0 h-screen w-64 border-r border-slate-200/80 bg-white p-6 space-y-6 overflow-y-auto">
      {/* Course Header & Topic Badge */}
      <div className="flex flex-col items-start gap-2 border-b border-slate-100 pb-5">
        <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
          Course Outline
        </span>
        <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
          {courseTitle}
        </h2>
        {courseTopic && (
          <span className="inline-block mt-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg">
            {courseTopic}
          </span>
        )}
      </div>

      {/* Chapters Navigation */}
      <div className="space-y-1">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Chapters
        </p>

        {chapterList.map((chapter, index) => (
          <a
            key={index}
            href={`#chapter-${index}`}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-all duration-200"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 text-[11px] font-bold transition-colors">
              {index + 1}
            </span>
            <span className="truncate flex-1">{chapter.chapterName}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}