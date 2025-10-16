export default function DashboardLoading() {
  return (
    <div className="min-w-screen min-h-screen flex flex-col justify-center items-center bg-[#0a0a0a]">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-[#333] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      
      {/* Loading Text */}
      <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
    </div>
  );
}
