"use client";
import { useEffect, useState } from "react";
import { ReaderShare } from "./readerShare";

export default function Sidebar({ title, topic, chapters, share, setShare }) {
  const [chaptersList, setChaptersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Sync props → state whenever chapters changes
  useEffect(() => {
    if (chapters && chapters.length > 0) {
      setChaptersList(chapters);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [chapters]);

  return (
    <nav className="sticky top-0 h-screen bg-slate-50/80 backdrop-blur-md p-6 text-slate-800 w-full max-w-[260px] border-r border-slate-200/80 overflow-y-auto flex flex-col justify-between">
      
      <div>
        {/* Course Title */}
        <div className="text-2xl font-extrabold text-slate-900 mb-2 leading-tight tracking-tight text-center">
          {title}
        </div>

        {/* Topic Badge */}
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-center text-lg truncate max-w-full">
            {topic}
          </span>
        </div>

        {/* Share CTA */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => { setShare(!share) }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all duration-200 shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
          >
            <span>Share Course</span>
            <ReaderShare className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Chapter Index Section */}
        <div className="border-t border-slate-200/80 pt-4">
          <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3 block px-2">
            Course Modules
          </span>

          <div className="space-y-1">
            {loading ? (
              // 🌀 Loader while waiting
              <div className="flex justify-center items-center h-32">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              chaptersList.map((chapter, index) => (
                <a
                  key={index}
                  href={`#chapter-${index}`}
                  className="group flex items-start gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-medium leading-snug break-words"
                >
                  <span className="text-slate-400 group-hover:text-blue-600 font-bold">
                    0{index + 1}.
                  </span>
                  <span className="flex-1">{chapter.chapterName}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-6 border-t border-slate-200/80 text-center">
        <span className="text-[11px] font-semibold text-slate-400 tracking-wide">
          Course<span className="text-blue-600">AI</span> Platform
        </span>
      </div>
    </nav>
  );
}