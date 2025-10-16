export function StatsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333] animate-pulse"
        >
          <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
          <div className="h-8 bg-gray-700 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
}
 