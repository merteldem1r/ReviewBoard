"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  _count: {
    items: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (roleFilter) params.append("role", roleFilter);

        const response = await fetch(`/api/admin/users?${params.toString()}`);
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [roleFilter]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUser(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role");
    } finally {
      setUpdatingUser(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "REVIEWER":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "USER":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-gray-400">Manage user accounts and roles</p>
          </div>
          <Link
            href="/dashboard/admin"
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all text-center"
          >
            ← Admin Dashboard
          </Link>
        </div>

        {/* Filter */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              disabled={isLoading}
              className="bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="">All Roles</option>
              <option value="USER">Users</option>
              <option value="REVIEWER">Reviewers</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <p className="text-gray-400">Loading users...</p>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && users.length > 0 && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-[#333]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#0a0a0a]/50">
                      <td className="px-6 py-4 text-sm font-medium">
                        @{user.username}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {user._count.items}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          disabled={updatingUser === user.id}
                          className="bg-[#0a0a0a] border border-[#333] rounded px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                        >
                          <option value="USER">User</option>
                          <option value="REVIEWER">Reviewer</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && users.length === 0 && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <h2 className="text-xl font-bold mb-2">No users found</h2>
            <p className="text-gray-400">
              {roleFilter
                ? "No users with the selected role"
                : "No users in the system"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
