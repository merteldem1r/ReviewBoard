"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function ReviewerUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/reviewer/users");
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "REVIEWER":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "USER":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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
            <h1 className="text-3xl font-bold mb-2">All Users</h1>
            <p className="text-gray-400">View all registered users</p>
          </div>
          <Link
            href="/dashboard/reviewer"
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all text-center"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <p className="text-gray-400">Loading users...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && users.length === 0 && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <h2 className="text-xl font-bold mb-2">No users found</h2>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && users.length > 0 && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-[#333]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#0a0a0a] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="text-blue-400 font-medium">
                          {user._count.items}
                        </span>{" "}
                        <span className="text-gray-500">items</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        {!isLoading && users.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-400">
            Showing {users.length} user{users.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </main>
  );
}
