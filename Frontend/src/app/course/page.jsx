"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { GeminiObject } from "../useContext";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import YouTubeVideo from "./youtubeapi";
import { SecondNavbar } from "./secondNavbar";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";

// Icons
import { ChevronDown } from "@/app/course/chevrondown";
import { ChevronUp } from "@/app/course/chevronUp";
import { VolumeHigh } from "@/app/course/volumehigh";
import { FileCopyOutlineSharp } from "../c/[courseId]/copy";
import { Tick01 } from "../c/[courseId]/tick";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function Courses() {
  const {
    geminiResponse,
    setGetminiResponse,
    geminiResponseArray,
    setGetminiResponseArray,
    geminiResultArray,
    setGetminiResultArray,
  } = useContext(GeminiObject);

  const [loading, setLoading] = useState(true);
  const [localChapters, setLocalChapters] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentQuestionSelected, setCurrentQuestionSelected] = useState({});

  // Audio / TTS States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startResumePause, setStartResumePause] = useState(false);
  const [wholeCurrentChapter, setWholeCurrentChapter] = useState(null);
  const [startChapterResumePause, setChapterStartResumePause] = useState(false);
  const [currentChapterTopic, setCurrentChapterTopic] = useState("");
  const [copyText, setCopyText] = useState("");

  const utteranceRef = useRef(null);
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();

  // TTS Control Functions
  const speak = (text) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
      setStartResumePause(false);
      setChapterStartResumePause(false);
    };

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
    setStartResumePause(false);
    setChapterStartResumePause(false);
  };

  const saveCourse = async () => {
    if (!geminiResponse.title || !geminiResponse.topic || geminiResultArray.length === 0) {
      toast.error("Course is incomplete!");
      return;
    }

    setSaving(true);
    try {
      const token = await getToken();
      console.log("TOKEN:", token);
      console.log({ isLoaded, isSignedIn, userId });

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/course/saveCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: geminiResponse.title,
          topic: geminiResponse.topic,
          chapters: geminiResultArray,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Course saved successfully!");
        console.log("Saved course:", data);
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Failed to save course");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  // Load saved course from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("geminiResponse");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setGetminiResponse(parsed);
        setGetminiResponseArray(parsed.chapters);
        setLocalChapters(parsed.chapters);
      }
    }
    setInitialized(true);
  }, []);

  // Generate chapters
  useEffect(() => {
    setLoading(true);

    if (!initialized) return;

    if (!localChapters || localChapters.length === 0) {
      router.push("/dashboard/dashboardform");
      return;
    }

    setGetminiResultArray([]);

    async function generateChapters() {
      for (let i = 0; i < geminiResponseArray.length; i++) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gemini/geminiChapters`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: geminiResponseArray[i],
              title: geminiResponse.title,
              topic: geminiResponse.topic,
            }),
          });
          const data = await response.json();
          const cleanedText = data.chapter.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanedText);
          console.log(parsed);
          setGetminiResultArray((prev) => [...prev, parsed]);
          toast.success(`Chapter ${i + 1} generated!`);
        } catch (err) {
          console.log(err);
          toast.error(`Error generating chapter ${i + 1}`);
        }
      }
      setLoading(false);
    }

    generateChapters();
  }, [initialized, localChapters, geminiResponse]);

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      <div className="flex justify-start min-h-screen">
        {/* Sidebar */}
        <Sidebar
          title={geminiResponse.title}
          topic={geminiResponse.topic}
          chapters={geminiResultArray}
          className="w-1/6"
        />

        {/* Main Content Area */}
        <div className="bg-slate-50 flex-1 w-5/6 border-l border-slate-200/80">
          <SecondNavbar className="w-full" />

          {/* Fixed Save Button */}
          {!loading && (
            <button
              onClick={saveCourse}
              disabled={saving}
              className="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-3 px-5 rounded-xl shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>💾</span> {saving ? "Saving..." : "Save Course"}
            </button>
          )}

          {/* Generated Chapters List */}
          {geminiResultArray.map((chapter, index) => (
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

                {/* Whole Chapter Audio Controls */}
                <div className="flex items-center gap-4 justify-center mb-8">
                  <button
                    onClick={() => {
                      if (!startResumePause || wholeCurrentChapter !== index) {
                        setStartResumePause(true);
                        setWholeCurrentChapter(index);
                        speak(
                          `${chapter.chapterName}. ${chapter.summary}. ${chapter.content
                            ?.map((c) => `${c.heading}. ${Array.isArray(c.text) ? c.text.join(" ") : c.text}`)
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

                  {startResumePause && wholeCurrentChapter === index && (
                    <div className="flex flex-row items-center justify-center gap-2">
                      {!isPaused ? (
                        <div
                          onClick={pause}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 cursor-pointer text-slate-700 text-xs font-semibold rounded-lg transition"
                        >
                          ⏸ Pause
                        </div>
                      ) : (
                        <div
                          onClick={resume}
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
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white cursor-pointer text-xs font-semibold rounded-lg transition"
                      >
                        ⏹ Stop
                      </div>
                    </div>
                  )}
                </div>

                {/* YouTube Video Section */}
                <div className="mb-8 rounded-xl overflow-hidden border border-slate-200/80">
                  <YouTubeVideo query={chapter.chapterName} />
                </div>

                {/* Chapter Topics / Sections */}
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
                      </span>

                      {/* Section Audio Toggle */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!startChapterResumePause || currentChapterTopic !== c.heading) {
                            setChapterStartResumePause(true);
                            setCurrentChapterTopic(c.heading);
                            speak(`${c.heading}. ${Array.isArray(c.text) ? c.text.join(" ") : c.text}`);
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
                    </summary>

                    {/* Topic TTS Controls */}
                    {startChapterResumePause && currentChapterTopic === c.heading && (
                      <div className="flex items-center gap-2 mb-4">
                        {!isPaused ? (
                          <div
                            onClick={pause}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 cursor-pointer text-slate-800 text-xs rounded-md"
                          >
                            ⏸
                          </div>
                        ) : (
                          <div
                            onClick={resume}
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
                          className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 cursor-pointer text-rose-700 text-xs rounded-md"
                        >
                          ⏹ Stop
                        </div>
                      </div>
                    )}

                    {/* Content Paragraphs */}
                    <div className="space-y-3 pt-2">
                      {Array.isArray(c.text) ? (
                        c.text.map((element, txtIdx) => (
                          <div
                            className="leading-relaxed border-b border-slate-100 pb-2 flex items-start gap-2.5"
                            key={txtIdx}
                          >
                            <span className="text-blue-600 font-bold text-xs mt-0.5">✓</span>
                            <div className="flex-1">
                              <ReactMarkdown>{element}</ReactMarkdown>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="leading-relaxed border-b border-slate-100 pb-2 flex items-start gap-2.5">
                          <span className="text-blue-600 font-bold text-xs mt-0.5">✓</span>
                          <div className="flex-1">
                            <ReactMarkdown>{c.text}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Monaco Code Editor Block */}
                    {c.code && (
                      <div className="mt-4">
                        <div className="w-full border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
                          {/* Copy Header Bar */}
                          <div className="flex justify-between items-center bg-slate-100/80 px-4 py-2 border-b border-slate-200">
                            <div className="text-xs font-mono font-semibold text-slate-600 uppercase">
                              {c.language || "code"}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium text-xs shadow-2xs"
                                onClick={() => {
                                  navigator.clipboard.writeText(c.code);
                                  toast.success("Copied!");
                                  setCopyText(c.code);
                                  setTimeout(() => setCopyText(""), 1000);
                                }}
                              >
                                <FileCopyOutlineSharp className="w-3.5 h-3.5 text-slate-500" />
                                <span>{copyText === c.code ? "Copied" : "Copy"}</span>
                              </button>

                              <div
                                className={`w-4 h-4 text-emerald-600 transition-opacity duration-300 ${
                                  copyText === c.code ? "opacity-100" : "opacity-0"
                                }`}
                              >
                                <Tick01 />
                              </div>
                            </div>
                          </div>

                          <MonacoEditor
                            value={c.code}
                            defaultLanguage={c.language || "javascript"}
                            height={`${Math.min(
                              c.code.split("\n").length * 24,
                              400
                            )}px`}
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

                        {/* Code Explanation Details */}
                        {c.codeExplanation && c.codeExplanation.length > 0 && (
                          <details className="mt-3 bg-slate-100/70 border border-slate-200 rounded-xl overflow-hidden">
                            <summary className="cursor-pointer text-slate-700 text-xs font-semibold px-4 py-2.5 select-none hover:bg-slate-200/50 transition-colors">
                              Show Code Explanation
                            </summary>

                            <div className="p-4 space-y-2 border-t border-slate-200 bg-white text-xs text-slate-600">
                              {c.codeExplanation.map((element, expIdx) => (
                                <div key={expIdx} className="border-b border-slate-100 pb-2 last:border-0">
                                  <ReactMarkdown>{element}</ReactMarkdown>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                  </details>
                ))}

                {/* Quiz Section */}
                {chapter.quiz?.length > 0 && (
                  <details className="mt-8 p-6 border border-blue-100 bg-blue-50/40 rounded-2xl" open>
                    <summary className="font-bold text-slate-900 text-xl mb-6 cursor-pointer select-none flex items-center gap-2">
                      <span>🧠 Interactive Quiz</span>
                    </summary>

                    {chapter.quiz.map((q, qIdx) => {
                      const questionKey = `${index}-${qIdx}`;
                      const selectedOption = currentQuestionSelected[questionKey];
                      const showResult = selectedOption != null;

                      return (
                        <div key={qIdx} className="mb-6 last:mb-0 bg-white border border-slate-200/80 p-5 rounded-xl shadow-xs">
                          <p className="text-slate-900 font-semibold text-sm mb-4">
                            {qIdx + 1}. {q.question}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = selectedOption === opt;
                              const isCorrect = q.correctAnswer === opt;

                              return (
                                <div
                                  key={optIdx}
                                  onClick={() => {
                                    setCurrentQuestionSelected((prev) => ({
                                      ...prev,
                                      [questionKey]: opt,
                                    }));
                                  }}
                                  className={`cursor-pointer px-4 py-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-between border ${
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

                          {/* Answer Result Banner */}
                          {showResult && (
                            <div
                              className={`mt-4 px-3.5 py-2.5 rounded-xl text-xs font-medium border ${
                                selectedOption === q.correctAnswer
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                  : "bg-rose-50 border-rose-200 text-rose-800"
                              }`}
                            >
                              Correct Answer: <span className="font-bold">{q.correctAnswer}</span>
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

          {/* Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-900 font-bold text-lg">Generating Chapter...</p>
              <p className="text-slate-500 text-xs mt-1">Please wait, this will take a moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}