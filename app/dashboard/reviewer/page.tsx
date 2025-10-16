import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import ReviewerStats from "@/components/reviewer/ReviewerStats";

export default async function ReviewerDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reviewer Dashboard</h1>
            <p className="text-gray-400">
              Welcome, @{session?.user?.username || "reviewer"}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all text-center"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Statistics Grid */}
        <ReviewerStats />

        {/* Quick Actions */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/reviewer/items"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-blue-500 transition-all group"
            >
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-bold mb-1 group-hover:text-blue-500">
                Review Items
              </h3>
              <p className="text-sm text-gray-400">
                View and manage all submitted items
              </p>
            </Link>
            <Link
              href="/dashboard/reviewer/users"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-blue-500 transition-all group"
            >
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-bold mb-1 group-hover:text-blue-500">
                Manage Users
              </h3>
              <p className="text-sm text-gray-400">
                View all users and their activities
              </p>
            </Link>
            <Link
              href="/dashboard/reviewer/tags"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-blue-500 transition-all group"
            >
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-bold mb-1 group-hover:text-blue-500">
                Manage Tags
              </h3>
              <p className="text-sm text-gray-400">
                View and configure risk tags
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
