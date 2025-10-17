import AdminStats from "@/components/admin/AdminStats";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">
              Welcome, @{session?.user?.username || "admin"}
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
        <AdminStats />

        {/* Management Actions */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-8">
          <h2 className="text-xl font-bold mb-6">System Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Users Management */}
            <Link
              href="/dashboard/admin/users"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-blue-500 transition-all group"
            >
              <div className="text-2xl mb-2">👥</div>
              <h3 className="font-bold mb-1 group-hover:text-blue-500">
                Manage Users
              </h3>
              <p className="text-sm text-gray-400">
                View, edit, and manage user accounts and roles
              </p>
            </Link>

            {/* Tags Management */}
            <Link
              href="/dashboard/admin/tags"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-purple-500 transition-all group"
            >
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-bold mb-1 group-hover:text-purple-500">
                Manage Tags
              </h3>
              <p className="text-sm text-gray-400">
                Create, edit tags and configure risk scores
              </p>
            </Link>

            {/* Rules Management */}
            <Link
              href="/dashboard/admin/rules"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-yellow-500 transition-all group"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-bold mb-1 group-hover:text-yellow-500">
                Risk Rules
              </h3>
              <p className="text-sm text-gray-400">
                View and configure risk calculation rules
              </p>
            </Link>

            {/* Items Overview */}
            <Link
              href="/dashboard/admin/items"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-green-500 transition-all group"
            >
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-bold mb-1 group-hover:text-green-500">
                Manage Items
              </h3>
              <p className="text-sm text-gray-400">
                View, manage and deactivate all submitted items
              </p>
            </Link>

            {/* Audit Logs */}
            <Link
              href="/dashboard/admin/audit-logs"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-red-500 transition-all group"
            >
              <div className="text-2xl mb-2">📜</div>
              <h3 className="font-bold mb-1 group-hover:text-red-500">
                Audit Logs
              </h3>
              <p className="text-sm text-gray-400">
                View system activity and change history
              </p>
            </Link>

            {/* System Settings */}
            <Link
              href="/dashboard/admin/settings"
              className="p-6 bg-[#0a0a0a] border border-[#333] rounded-lg hover:border-orange-500 transition-all group"
            >
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="font-bold mb-1 group-hover:text-orange-500">
                System Settings
              </h3>
              <p className="text-sm text-gray-400">
                Configure system-wide settings and preferences
              </p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
