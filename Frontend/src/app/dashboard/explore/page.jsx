import Allcourse from "./allcourses";

export default function Explore() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="max-w-7xl mx-auto px-6 py-10 md:py-14 space-y-8">
        {/* Page Header */}
        <header className="flex flex-col items-center text-center space-y-2 border-b border-slate-200/80 pb-8">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
            Discover & Learn
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Explore Courses
          </h1>
          <p className="text-slate-500 text-xs md:text-sm max-w-xl">
            Browse through all available community and generated learning tracks to start your next topic today.
          </p>
        </header>

        {/* Courses Container */}
        <div className="w-full">
          <Allcourse />
        </div>
      </main>
    </div>
  );
}