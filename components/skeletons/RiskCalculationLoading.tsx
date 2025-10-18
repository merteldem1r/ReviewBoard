export default function RiskCalculationLoading() {
  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-400">
              Calculating Risk Score
            </h3>
            <p className="text-sm text-gray-400">
              Analyzing tags and amount...
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <span>Processing selected tags...</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
          </div>
          <span>Evaluating amount risk...</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
          </div>
          <span>Creating audit log...</span>
        </div>
      </div>

      <div className="mt-4 h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
      </div>
    </div>
  );
}
