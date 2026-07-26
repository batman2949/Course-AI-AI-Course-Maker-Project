export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 border-solid"></div>
      <div className="text-blue-600 font-extrabold text-4xl mt-9">Loading...</div>
    </div>
  );
}
