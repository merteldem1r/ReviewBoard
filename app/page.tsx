import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] px-4"> 
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          ReviewBoard
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Mini Deal/Issue Review System
        </p>
        <p className="text-gray-400 mb-12">
          Submit deals, calculate risk scores automatically, and streamline your review workflow.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white font-medium rounded-lg transition-all"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="font-bold mb-2">Secure Auth</h3>
            <p className="text-sm text-gray-400">
              Login with Email or GitHub
            </p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-bold mb-2">Risk Scoring</h3>
            <p className="text-sm text-gray-400">
              Automatic rule-based risk calculation
            </p>
          </div>
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-bold mb-2">Audit Logs</h3>
            <p className="text-sm text-gray-400">
              Track every change with full audit trail
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
