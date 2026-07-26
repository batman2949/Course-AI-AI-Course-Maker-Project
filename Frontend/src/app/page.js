"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function HomePage() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    toast.loading("Preparing your workspace...", { duration: 2000 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-violet-200 text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Top Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-blue-200/40 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-blue-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white shadow-md shadow-blue-500/20">
              ⚡
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Course<span className="text-blue-600">AI</span>
              </span>
              <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                PRO 2.0
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="transition hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="transition hover:text-blue-600">How it Works</a>
          </div>

          <Link
            href="/dashboard"
            onClick={handleClick}
            className={`group relative inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 ${
              clicked ? "pointer-events-none opacity-70" : ""
            }`}
          >
            {clicked ? "Setting up..." : "Get Started"}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-20 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              Next-Gen AI Learning Platform
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl leading-[1.15]">
              Master Any Skill with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Personalized AI Courses
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Transform raw topics, concepts, or skills into fully structured learning paths complete with modules, interactive quizzes, and step-by-step progress tracking.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                onClick={handleClick}
                className={`rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 ${
                  clicked ? "pointer-events-none opacity-70" : ""
                }`}
              >
                Create Your Course Free →
              </Link>

              <a
                href="#how-it-works"
                className="rounded-xl border border-blue-200 bg-white px-8 py-4 font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50/50"
              >
                How It Works
              </a>
            </div>

            {/* Live Metrics */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-200/80 pt-8">
              <div>
                <p className="text-3xl font-black text-blue-600">100k+</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Courses Generated</p>
              </div>
              <div>
                <p className="text-3xl font-black text-blue-600">98%</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Completion Rate</p>
              </div>
              <div>
                <p className="text-3xl font-black text-blue-600">&lt; 30s</p>
                <p className="text-xs font-medium text-slate-500 mt-1">Avg Creation Time</p>
              </div>
            </div>
          </div>

          {/* Right Hero Preview Card */}
          <div className="relative lg:col-span-5">
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-400 to-white opacity-20 blur-xl" />
            
            <div className="relative rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl shadow-blue-900/10">
              {/* Window Header Controls */}
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Mock Dashboard Card */}
              <div className="space-y-4">
                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wide uppercase text-blue-600">Active Course</span>
                    <span className="text-xs font-semibold text-slate-500">4 Chapters</span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-slate-900">React & Next.js Architecture</h3>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "01. Fundamentals & App Router", status: "Ready"},
                    { name: "02. Server Components & Actions", status: "Ready"},
                    { name: "03. State & Context Management", status: "Ready"},
                    { name: "04. Fullstack Deployment", status: "Locked"},
                  ].map((module, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs text-slate-700"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        <span className="font-medium">{module.name}</span>
                      </div>
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600 shadow-2xs">
                        {module.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl bg-blue-600 p-3 text-center text-xs font-semibold text-white shadow-md shadow-blue-600/20">
                  ✓ Interactive AI Quiz Ready
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 border-t border-blue-100/80 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="text-xs font-extrabold tracking-widest uppercase text-blue-600">Workflow</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">How CourseAI Works</h2>
            <p className="mt-3 text-slate-600">3 simple steps to generate your tailored learning roadmap</p>
          </div>

          <div className="mt-16 flex gap-8 justify-center">
            {[
              {
                step: "01",
                title: "Specify Your Topic",
                desc: "Enter any subject, target skill, or upload your reference study materials.",
              },
              {
                step: "02",
                title: "AI Crafts the Course",
                desc: "Our engine structures comprehensive chapters, key takeaways, and lessons.",
              },
              {
                step: "03",
                title: "Learn & Test Knowledge",
                desc: "Read modular units, complete AI-generated quizzes, and track your growth.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-200 to-white p-8 cursor-pointer hover:scale-110 transition shadow-sm hover:shadow-md hover:border-blue-200"
              >
                <span className="text-4xl font-black text-blue-950">{item.step}</span>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 border-t border-blue-100/80 bg-blue-50/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="text-xs font-extrabold tracking-widest uppercase text-blue-600">Capabilities</span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Why Choose CourseAI?</h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "AI Generated",
                desc: "Instantly create structured paths tailored to your goals.",
              },
              {
                title: "Smart Quizzes",
                desc: "Evaluate understanding after every chapter automatically.",
              },
              {
                title: "Structured Content",
                desc: "Organized modular lessons designed for optimal retention.",
              },
              {
                title: "Progress Tracking",
                desc: "Monitor your completion rates and pick up where you left off.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-blue-100 bg-white p-8 shadow-md shadow-blue-500/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-20 bg-white border-t border-blue-100/80">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 text-white shadow-2xl shadow-blue-600/30">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Start Learning Something New Today
            </h2>
            <p className="mt-4 text-blue-100 max-w-xl mx-auto text-sm leading-relaxed">
              Experience personalized AI learning paths tailored to your exact pacing and skill requirements.
            </p>
            <div className="mt-8">
              <Link
                href="/dashboard"
                onClick={handleClick}
                className="inline-block rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 shadow-md transition hover:bg-blue-50 hover:shadow-lg"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}