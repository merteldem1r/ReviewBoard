"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Tag {
  id: string;
  name: string;
  score: number;
  color: string;
  is_active: boolean;
  created_at: string;
  _count: {
    items: number;
  };
}

export default function ReviewerTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchTags() {
      setIsLoading(true);
      try {
        const response = await fetch("/api/reviewer/tags");
        const data = await response.json();
        setTags(data.tags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTags();
  }, []);

  const filteredTags = tags.filter((tag) => {
    if (statusFilter === "active") return tag.is_active;
    if (statusFilter === "inactive") return !tag.is_active;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 10) return "text-green-400";
    if (score <= 20) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Tags</h1>
            <p className="text-gray-400">View and configure risk assessment tags</p>
          </div>
          <Link
            href="/dashboard/reviewer"
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all text-center"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              disabled={isLoading}
              className="bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="all">All Tags</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <p className="text-gray-400">Loading tags...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTags.length === 0 && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <h2 className="text-xl font-bold mb-2">No tags found</h2>
            <p className="text-gray-400">
              {statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No tags have been created yet"}
            </p>
          </div>
        )}

        {/* Tags Grid */}
        {!isLoading && filteredTags.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 hover:border-[#444] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div
                      className="inline-block px-4 py-2 rounded-lg font-bold mb-3"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        border: `2px solid ${tag.color}`,
                      }}
                    >
                      {tag.name}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      tag.is_active
                        ? "bg-green-500/10 text-green-400"
                        : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {tag.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Risk Score:</span>
                    <span
                      className={`text-lg font-bold ${getRiskScoreColor(
                        tag.score
                      )}`}
                    >
                      +{tag.score}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Used in Items:</span>
                    <span className="text-sm font-medium text-blue-400">
                      {tag._count.items}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#333]">
                    <span className="text-xs text-gray-500">Created:</span>
                    <span className="text-xs text-gray-400">
                      {formatDate(tag.created_at)}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${tag.color}00, ${tag.color})`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {!isLoading && filteredTags.length > 0 && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-6 bg-[#1a1a1a] border border-[#333] rounded-lg px-6 py-3">
              <div className="text-sm">
                <span className="text-gray-400">Total Tags:</span>{" "}
                <span className="font-bold text-white">{tags.length}</span>
              </div>
              <div className="h-4 w-px bg-[#333]"></div>
              <div className="text-sm">
                <span className="text-gray-400">Active:</span>{" "}
                <span className="font-bold text-green-400">
                  {tags.filter((t) => t.is_active).length}
                </span>
              </div>
              <div className="h-4 w-px bg-[#333]"></div>
              <div className="text-sm">
                <span className="text-gray-400">Inactive:</span>{" "}
                <span className="font-bold text-gray-400">
                  {tags.filter((t) => !t.is_active).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
