import ItemStats from "@/components/items/ItemStats";
import { StatsLoadingSkeleton } from "@/components/skeletons/ItemLoadingSkeleton";
import { SignOut } from "@/components/ui/signOut";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, @{session.user?.username || "username"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all cursor-pointer"
            >
              Profile
            </Link>
            <SignOut />
          </div>
        </div>

        {/* Quick Stats */}
        <Suspense fallback={<StatsLoadingSkeleton />}>
          <ItemStats />
        </Suspense>

        {/* Actions */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          <h2 className="text-xl font-bold mb-4">Manage Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/user/items"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-blue-500 transition-all group"
            >
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-bold mb-1 group-hover:text-blue-500">
                View All Items
              </h3>
              <p className="text-sm text-gray-400">
                Browse and filter submitted items
              </p>
            </Link>
            <Link
              href="/dashboard/user/items/new"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-blue-500 transition-all group"
            >
              <div className="text-2xl mb-2">➕</div>
              <h3 className="font-bold mb-1 group-hover:text-blue-500">
                Create New Item
              </h3>
              <p className="text-sm text-gray-400">
                Submit a new deal for review
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
