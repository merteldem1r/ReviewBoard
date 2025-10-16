"use client";

import { useEffect, useState } from "react";

interface ReviewerStats {
  totalUsers: number;
  totalItems: number;
  pendingReviewItems: number;
  approvedItems: number;
  rejectedItems: number;
  activeTags: number;
}

export default function ReviewerStats() {
  const [stats, setStats] = useState<ReviewerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/reviewer/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8">
        <p className="text-red-400">Error loading statistics: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
        <div className="text-gray-400 text-sm mb-1">Total Users</div>
        <div className="text-3xl font-bold text-blue-400">
          {stats.totalUsers}
        </div>
      </div>
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
        <div className="text-gray-400 text-sm mb-1">Total Items</div>
        <div className="text-3xl font-bold">{stats.totalItems}</div>
      </div>
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
        <div className="text-gray-400 text-sm mb-1">Pending Review</div>
        <div className="text-3xl font-bold text-yellow-400">
          {stats.pendingReviewItems}
        </div>
      </div>
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
        <div className="text-gray-400 text-sm mb-1">Approved</div>
        <div className="text-3xl font-bold text-green-400">
          {stats.approvedItems}
        </div>
      </div>
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
        <div className="text-gray-400 text-sm mb-1">Rejected</div>
        <div className="text-3xl font-bold text-red-400">
          {stats.rejectedItems}
        </div>
      </div>
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
        <div className="text-gray-400 text-sm mb-1">Active Tags</div>
        <div className="text-3xl font-bold text-purple-400">
          {stats.activeTags}
        </div>
      </div>
    </div>
  );
}
