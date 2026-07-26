"use client";
import { useEffect, useState, useRef } from "react";
import Sidebar from "./sidebar";
import { ChevronDown } from "@/app/course/chevrondown";
import { ChevronUp } from "@/app/course/chevronUp";
import { VolumeHigh } from "@/app/course/volumehigh";
import YouTubeVideo from "@/app/course/youtubeapi";
import ReactMarkdown from "react-markdown";
import { SecondNavbar } from "@/app/course/secondNavbar";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { use } from "react";
import dynamic from "next/dynamic";
import { EmailIcon, EmailShareButton, FacebookIcon, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, ThreadsIcon, TwitterIcon, TwitterShareButton, WhatsappIcon, FacebookShareButton, WhatsappShareButton } from "react-share";
import { usePathname } from "next/navigation";
import { ReaderShare } from "./readerShare";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FileCopyOutlineSharp } from "./copy";
import { Tick01 } from "./tick";
import { SharpStar } from "./star";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false, // this disables server-side rendering
});

export default function CoursePage({ params }) {
  const [course, setCourse] = useState(null); // start as null
  const [loading, setLoading] = useState(true); // track loading
  const [currentQuestionSelected, setCurrentQuestionSelected] = useState([]);
  const [startResumePause, setStartResumePause] = useState(false);
  const [startChapterResumePause, setChapterStartResumePause] = useState(false);
  const [wholeCurrentChapter, setWholeCurrentChapter] = useState(null);
  const [currentChapterTopic, setCurrentChapterTopic] = useState("");
  const [markedChapters, setMarkedChapters] = useState([]);
  const [marking, setMarking] = useState("");
  const [copy, setCopy] = useState(false);
  const [share, setShare] = useState(false);
  const [copyText, setCopyText] = useState("");

  const [importantChapters, setImportantChapters] = useState([]);
  const [markingimportant, setMarkingImportant] = useState(false);

  const paramsdata = use(params);

  const { getToken } = useAuth();

  const pathName = usePathname();

  const fetchMarkedChapters = async () => {
    const token = await getToken();

    const courseId = await paramsdata.courseId;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/marked/list/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log("Marked Chapters:", data);
    await setMarkedChapters(data?.markedChapters);
    console.log(markedChapters);

    if (response.status !== 200) {
      toast.error("Error fetching marked chapters");
      return;
    }

  };

  const fetchImportantChapters = async () => {
    const token = await getToken();

    const courseId = await paramsdata.courseId;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/important/list/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log("Important Chapters:", data);
    await setImportantChapters(data?.importantContents);
    console.log(importantChapters);

    if (response.status !== 200) {
      toast.error("Error fetching important chapters");
      return;
    }

  };


  useEffect(() => {
    fetchMarkedChapters();
    fetchImportantChapters();
  }, [])

  // --- TTS states ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);

  // 🟢 TTS Handlers
  const speak = (text) => {
    speechSynthesis.cancel(); // stop old
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);

    setIsSpeaking(true);
    setIsPaused(false);
  };

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      setIsPaused(true);
      speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (speechSynthesis.paused) {
      setIsPaused(false);
      speechSynthesis.resume();
    }
  };

  const cancel = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };


  async function getCourse() {
    try {
      const courseId = paramsdata.courseId;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/course/${courseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setCourse(data.course);
    } catch (err) {
      console.log(err);
      alert("Error fetching course data");
    } finally {
      setLoading(false); // stop loader always
    }
  }

  useEffect(() => {
    getCourse();
  }, []);

  if (loading) {
    return (
      <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f8fafc">
        <div className="min-h-screen flex flex-col bg-slate-50">

          {/* Layout with Sidebar + Content */}
          <div className="flex flex-1">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col sticky w-64 h-screen top-0 border-r border-slate-200 bg-white p-6 space-y-6">
              {/* User Profile */}
              <div className="flex flex-col items-center gap-3">
                <Skeleton width={110} height={30} />
                <div className="flex flex-col items-center gap-2">
                  <Skeleton width={100} height={16} />
                  <Skeleton width={80} height={14} />
                </div>
              </div>

              {/* Sidebar Links */}
              <div className="space-y-4">
                <Skeleton width={140} height={18} />
                <Skeleton width={120} height={18} />
                <Skeleton width={100} height={18} />
                <Skeleton width={160} height={18} />
              </div>
            </aside>

            {/* Page Content */}
            <main className="flex-1 bg-slate-50">

              {/* Navbar */}
              <nav className="flex sticky top-0 z-50 items-center justify-end px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                {/* Profile / Icon */}
                <div className="flex items-center space-x-3">
                  <Skeleton width={80} height={18} />
                  <Skeleton width={80} height={18} />
                  <Skeleton circle width={36} height={36} />
                </div>
              </nav>

              <div className="p-8 max-w-5xl mx-auto space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-4 bg-white"
                  >
                    <Skeleton height={200} className="rounded-xl" />
                    <Skeleton width={`70%`} height={24} />
                    <Skeleton width={`95%`} height={16} />
                    <Skeleton width={`90%`} height={16} />
                    <div className="flex space-x-3 mt-4">
                      <Skeleton width={90} height={36} className="rounded-xl" />
                      <Skeleton width={90} height={36} className="rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 text-rose-600 font-semibold text-sm">
        ❌ Course not found. Please Create a New Course
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      <div className="flex justify-start min-h-screen">
        {/* Sidebar / Navbar */}
        <Sidebar
          title={course.title}
          topic={course.topic}
          chapters={course.chapters}
          share={share}
          setShare={setShare}
          className="w-1/6"
        />

        {/* Main Content */}
        <div className="bg-slate-50 flex-1 w-5/6 border-l border-slate-200/80">

          <SecondNavbar className="w-full" />

          {/* Share Course Modal */}
          {share && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4"
              onClick={() => setShare(false)} // click outside closes modal
            >
              {/* Modal content with transition */}
              <div
                className={`w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5 border border-slate-100 transform transition-all duration-200 ${share ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                onClick={(e) => e.stopPropagation()} // stop closing when clicking inside
              >
                {/* Heading */}
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="text-blue-600 text-3xl">
                    <ReaderShare />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Share This Course With Your Friends!
                  </h3>
                </div>

                {/* Social Buttons */}
                <div className="flex gap-4 my-2">
                  <WhatsappShareButton url={window.location.href}>
                    <WhatsappIcon className="w-10 h-10 hover:scale-105 transition-transform duration-200 cursor-pointer rounded-full" />
                  </WhatsappShareButton>
                  <TwitterShareButton url={window.location.href}>
                    <TwitterIcon className="w-10 h-10 hover:scale-105 transition-transform duration-200 cursor-pointer rounded-full" />
                  </TwitterShareButton>
                  <TelegramShareButton url={window.location.href}>
                    <TelegramIcon className="w-10 h-10 hover:scale-105 transition-transform duration-200 cursor-pointer rounded-full" />
                  </TelegramShareButton>
                  <FacebookShareButton url={window.location.href}>
                    <FacebookIcon className="w-10 h-10 hover:scale-105 transition-transform duration-200 cursor-pointer rounded-full" />
                  </FacebookShareButton>
                </div>

                {/* URL with Copy Button */}
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="flex-1 truncate text-xs text-slate-600 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Course URL Copied!");
                      setCopy(true);
                      setTimeout(() => setCopy(false), 2000); // reset after 2s
                    }}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-200 shadow-sm"
                  >
                    {copy ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Subtitle */}
                <p className="text-slate-400 text-xs text-center">
                  Share this course link and help your friends join the learning journey! 🚀
                </p>
              </div>
            </div>
          )}


          {course.chapters?.map((chapter, index) => (
            <div className="w-full max-w-5xl mx-auto p-6" key={index}>
              <section
                id={`chapter-${index}`}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-blue-500/5 p-8"
              >
                <div className="text-center mb-6">
                  <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                    Chapter {index + 1}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
                    {chapter.chapterName}
                  </h3>
                </div>

                <p className="rounded-xl text-center bg-blue-50/70 border border-blue-100/80 text-slate-700 text-sm md:text-base leading-relaxed p-4 mb-6 font-medium">
                  {chapter.summary}
                </p>

                {/* 🔊 Play Whole Chapter */}
                <div className="flex items-center gap-4 justify-center mb-8">
                  <button
                    onClick={() => {
                      if (!startResumePause) {
                        setStartResumePause(true);
                        setWholeCurrentChapter(index);
                        speak(
                          `${chapter.chapterName}. ${chapter.summary}. ${chapter.content
                            ?.map((c) => `${c.heading}. ${c.text.join(" ")}`)
                            .join(" ")}`
                        );
                      } else {
                        setStartResumePause(false);
                        setWholeCurrentChapter(null);
                        cancel();
                      }
                    }}
                    className="bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <VolumeHigh className="w-4 h-4 text-white" />
                    <span>Play Whole Chapter</span>
                  </button>

                  {startResumePause && wholeCurrentChapter == index && (
                    <div className="flex flex-row items-center justify-center gap-2">
                      {!isPaused && (
                        <div
                          onClick={pause}
                          disabled={!isSpeaking || isPaused}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-700 text-xs font-semibold rounded-lg transition"
                        >
                          ⏸ Pause
                        </div>
                      )}
                      {isPaused && (
                        <div
                          onClick={resume}
                          disabled={!isPaused}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-700 text-xs font-semibold rounded-lg transition"
                        >
                          ▶ Resume
                        </div>
                      )}
                      <div
                        onClick={() => {
                          setStartResumePause(false);
                          cancel();
                        }}
                        disabled={!isSpeaking}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white cursor-pointer text-xs font-semibold rounded-lg transition"
                      >
                        ⏹ Stop
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-8 rounded-xl overflow-hidden border border-slate-200/80">
                  <YouTubeVideo query={chapter.chapterName} />
                </div>

                {chapter.content?.map((c, i) => (
                  <details
                    key={i}
                    open
                    className="mb-6 group border border-slate-200/80 bg-gradient-to-tl from-blue-200 to-white p-5 rounded-2xl transition-all"
                  >
                    <summary className="text-lg text-slate-900 font-bold mb-3 flex items-center justify-between select-none cursor-pointer">
                      <span className="flex gap-3 items-center text-xl group-hover:text-blue-600 transition-colors duration-200">
                        <ChevronDown className="w-4 h-4 group-open:hidden inline transition-transform" />
                        <ChevronUp className="w-4 h-4 hidden group-open:inline transition-transform" />
                        {c.heading}
                        {importantChapters.includes(c.heading) && (
                          <div className="flex items-center"><SharpStar className="w-4 h-4 text-amber-500" /></div>
                        )}
                      </span>
                      
                      <div className="flex items-center gap-3">
                        {markedChapters.includes(c.heading) && (
                          <span className="bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            ✓ Completed
                          </span>
                        )}

                        {/* 🔊 Play Section */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!startChapterResumePause) {
                              setChapterStartResumePause(true);
                              setCurrentChapterTopic(c.heading);
                              speak(`${c.heading}. ${c.text.join(" ")}`);
                            } else {
                              setChapterStartResumePause(false);
                              setCurrentChapterTopic("");
                              cancel();
                            }
                          }}
                          className="cursor-pointer text-slate-400 hover:text-blue-600 p-1 transition-colors"
                        >
                          <VolumeHigh className="w-4 h-4" />
                        </div>
                      </div>
                    </summary>

                    {/* Controls below heading */}
                    {startChapterResumePause &&
                      currentChapterTopic == c.heading && (
                        <div className="flex items-center gap-2 mb-4">
                          {!isPaused && (
                            <div
                              onClick={pause}
                              disabled={!isSpeaking || isPaused}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 cursor-pointer text-slate-800 text-xs rounded-md"
                            >
                              ⏸
                            </div>
                          )}
                          {isPaused && (
                            <div
                              onClick={resume}
                              disabled={!isPaused}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 cursor-pointer text-slate-800 text-xs rounded-md"
                            >
                              ▶
                            </div>
                          )}
                          <div
                            onClick={() => {
                              setCurrentChapterTopic("");
                              setChapterStartResumePause(false);
                              cancel();
                            }}
                            disabled={!isSpeaking}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 cursor-pointer text-rose-700 text-xs rounded-md"
                          >
                            ⏹ Stop
                          </div>
                        </div>
                      )}

                    <div className="space-y-3 pt-2">
                      {c.text.map((element, index) => (
                        <div className=" leading-relaxed border-b  border-slate-100 pb-2 flex items-start gap-2.5" key={index}>
                          <span className="text-blue-600 font-bold text-xs mt-0.5">✓</span>
                          <div className="flex-1">
                            <ReactMarkdown>
                              {element}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>

                    {c.code && (
                      <div className="mt-4">
                        <div className="w-full border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                          {/* Copy Navbar */}
                          <div className="flex justify-between items-center bg-slate-100/80 px-4 py-2 border-b border-slate-200">
                            {/* Language */}
                            <div className="text-xs font-mono font-semibold text-slate-600 uppercase">
                              {c.language ? c.language : "code"}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {/* Copy Button */}
                              <button
                                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium text-xs shadow-2xs"
                                onClick={() => {
                                  navigator.clipboard.writeText(c.code);
                                  toast.success("Copied!");
                                  setCopyText(c.code);
                                  setTimeout(() => {
                                    setCopyText("");
                                  }, 1000);
                                }}
                              >
                                <FileCopyOutlineSharp className="w-3.5 h-3.5 text-slate-500" />
                                <span>{copyText === c.code ? "Copied" : "Copy"}</span>
                              </button>

                              {/* Tick Icon */}
                              <div className={`w-4 h-4 text-emerald-600 transition-opacity duration-300 ${copyText === c.code ? "opacity-100" : "opacity-0"}`}>
                                <Tick01 />
                              </div>
                            </div>
                          </div>

                          <MonacoEditor
                            value={c.code}
                            defaultLanguage={c.language}
                            height={`${Math.min(
                              c.code.split("\n").length * 24,
                              400
                            )}px`} // dynamic height up to max 400px
                            theme="vs-light"
                            options={{
                              readOnly: true,
                              minimap: { enabled: false },
                              wordWrap: "on",
                              fontWeight: "normal",
                              scrollBeyondLastLine: false,
                              fontSize: 13,
                              padding: { top: 16, bottom: 16 },
                              scrollbar: {
                                verticalScrollbarSize: 6,
                                vertical: "visible",
                                handleMouseWheel: true,
                              },
                            }}
                          />
                        </div>

                        {c.codeExplanation && c.codeExplanation.length > 0 && (
                          <details className="mt-3 bg-slate-100/70 border border-slate-200 rounded-xl overflow-hidden">
                            <summary className="cursor-pointer text-slate-700 text-xs font-semibold px-4 py-2.5 select-none hover:bg-slate-200/50 transition-colors">
                              Show Code Explanation
                            </summary>

                            <div className="p-4 space-y-2 border-t border-slate-200 bg-white text-xs text-slate-600">
                              {c.codeExplanation.map((element, index) => (
                                <div key={index} className="border-b border-slate-100 pb-2 last:border-0">
                                  <ReactMarkdown>{element}</ReactMarkdown>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}


                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-5 border-t border-slate-200/60 pt-4">
                      {!markedChapters.includes(c.heading) &&
                        <button className={`${marking === c.heading ? "pointer-events-none opacity-50" : ""} bg-emerald-600 hover:bg-emerald-700 cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-xs`} onClick={
                          async () => {
                            setMarking(c.heading);
                            const token = await getToken();
                            const k = await paramsdata.courseId;

                            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/marked/save`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                courseId: k,
                                chapterName: c.heading

                              }),
                            });

                            if (response.status === 200) {
                              // setMarkedButtonClicked(c.heading);
                              // ✅ Update UI instantly without waiting for fetchMarkedChapters
                              const k = [...markedChapters, c.heading];
                              setMarkedChapters(k);

                              toast.success("Chapter marked");
                            } else {
                              toast.error("Error marking chapter. Try again later");
                            }
                            setMarking("");
                          }
                        }>{marking === c.heading ? "Marking..." : "✓ Mark Complete"}</button>}

                      {!importantChapters.includes(c.heading) &&
                        <button className={`${markingimportant === c.heading ? "pointer-events-none opacity-50" : ""} bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs`} onClick={
                          async () => {
                            setMarkingImportant(c.heading);
                            const token = await getToken();
                            const k = await paramsdata.courseId;

                            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/important/save`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                courseId: k,
                                chapterName: c.heading

                              }),
                            });

                            if (response.status === 200) {
                              // setMarkedButtonClicked(c.heading);
                              // ✅ Update UI instantly without waiting for fetchMarkedChapters
                              const k = [...importantChapters, c.heading];
                              setImportantChapters(k);

                              toast.success("Chapter marked");
                            } else {
                              toast.error("Error marking chapter. Try again later");
                            }
                            setMarkingImportant("");
                          }
                        }>{markingimportant === c.heading ? "Please Wait..." : "★ Mark Important"}</button>}
                    </div>
                  </details>
                ))}

                {/* Quiz Section */}
                {/* Quiz Section */}
{chapter.quiz?.length > 0 && (
  <details
    className="mt-8 p-6 border border-blue-100 bg-blue-50/40 rounded-2xl"
    open
  >
    <summary className="font-bold text-slate-900 text-xl mb-6 cursor-pointer select-none flex items-center gap-2">
      <span>🧠 Interactive Quiz</span>
    </summary>

    {chapter.quiz.map((q, i) => {
      const questionKey = `${index}-${i}`;

      return (
        <div
          key={questionKey}
          className="mb-6 last:mb-0 bg-white border border-slate-200/80 p-5 rounded-xl shadow-xs"
        >
          <p className="text-slate-900 font-semibold text-sm mb-4">
            {i + 1}. {q.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, idx) => {
              const isSelected =
                currentQuestionSelected[questionKey] === opt;

              const isCorrect = q.correctAnswer === opt;

              const showResult =
                currentQuestionSelected[questionKey] != null;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentQuestionSelected((prev) => ({
                      ...prev,
                      [questionKey]: opt,
                    }));
                  }}
                  className={`cursor-pointer px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between border
                    ${
                      !showResult
                        ? "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
                        : isSelected && isCorrect
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                        : isSelected && !isCorrect
                        ? "bg-rose-600 border-rose-600 text-white shadow-xs"
                        : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
                    }`}
                >
                  <span>{opt}</span>

                  {showResult && isSelected && (
                    <span className="ml-2 text-sm font-bold text-white">
                      {isCorrect ? "✓" : "✕"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {currentQuestionSelected[questionKey] != null && (
            <div
              className={`mt-4 px-3.5 py-2.5 rounded-xl text-xs font-medium border ${
                currentQuestionSelected[questionKey] === q.correctAnswer
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              }`}
            >
              Correct Answer:{" "}
              <span className="font-bold">{q.correctAnswer}</span>
            </div>
          )}
        </div>
      );
    })}
  </details>
)}

              </section>


            </div>
          ))}
        </div>
      </div>
    </div>
  );
}