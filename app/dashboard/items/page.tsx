import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function ItemsPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Items</h1>
            <p className="text-gray-400">Manage and review submitted deals</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/items/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              + New Item
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2">
                <option>All</option>
                <option>New</option>
                <option>In Review</option>
                <option>Approved</option>
                <option>Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Risk Score
              </label>
              <select className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2">
                <option>All</option>
                <option>Low (0-30)</option>
                <option>Medium (31-60)</option>
                <option>High (61-100)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tag</label>
              <select className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2">
                <option>All</option>
                <option>AI</option>
                <option>Fintech</option>
                <option>Healthcare</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
          <h2 className="text-xl font-bold mb-2">No items yet</h2>
          <p className="text-gray-400 mb-6">
            Get started by creating your first item for review
          </p>
          <Link
            href="/items/new"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            Create First Item
          </Link>
        </div>
      </div>
    </main>
  );
}
