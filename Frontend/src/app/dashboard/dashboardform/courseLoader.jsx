'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ChapterListSkeleton() {
  // We'll simulate at least 2 chapters
  const chapters = [1, 2];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-white p-6">
      {/* Header */}
      <header className="flex justify-between w-full items-center mb-8">
        
        <Skeleton width={200} height={40} />
        <p className="text-black text-2xl animate-pulse font-extrabold">
            🚀 Making your course...
          </p>
        <div className="scale-125">
          <Skeleton circle width={40} height={40} />
        </div>
      </header>

      {/* Editable Course Info */}
      <section className="bg-white shadow-lg rounded-xl p-6 mb-8 border-l-8 border-purple-500">
        <Skeleton width="60%" height={36} className="mb-3" />
        <div className="mb-2 flex items-center gap-2">
          <Skeleton width={60} height={20} />
          <Skeleton width="40%" height={20} />
        </div>
        <p className="text-gray-700 mb-1">
          <Skeleton width={120} height={20} />
        </p>
        <p className="text-gray-700 mb-1">
          <Skeleton width={150} height={20} />
        </p>
      </section>

      {/* Chapters List */}
      <div className="flex flex-col gap-2 w-full">
        {chapters.map((_, index) => (
          <div key={index} >
            <div className="flex justify-end">
              <Skeleton width={100} height={30} className="rounded-t-md" />
            </div>
            <div className="bg-white text-black shadow-lg rounded-xl p-5 space-y-3 hover:shadow-2xl transition-shadow duration-300">
              {/* Chapter Name */}
              <Skeleton width="80%" height={28} />

              {/* Level Button */}
              <Skeleton width={100} height={30} className="rounded-md" />

              {/* Description */}
              <Skeleton count={2} width="100%" height={40} />
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-center">
        <Skeleton width={250} height={50} className="rounded-full" />
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500">
        <Skeleton width={150} height={20} />
      </footer>
    </div>
  );
}
