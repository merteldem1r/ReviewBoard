"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@prisma/client";

interface Item {
  id: string;
  title: string;
  description: string;
  amount: string;
  tags: Tag[];
  status: string;
  risk_score: number | null;
  created_at: string;
  user: User;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

export default function ReviewerItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  // Fetch tags for filter dropdown
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        setTags(data.tags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    }
    fetchTags();
  }, []);

  // Fetch items with filters
  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append("status", statusFilter);
        if (tagFilter) params.append("tag", tagFilter);

        if (riskFilter === "low") {
          params.append("minRisk", "0");
          params.append("maxRisk", "30");
        } else if (riskFilter === "medium") {
          params.append("minRisk", "31");
          params.append("maxRisk", "60");
        } else if (riskFilter === "high") {
          params.append("minRisk", "61");
          params.append("maxRisk", "100");
        }

        const response = await fetch(
          `/api/reviewer/items?${params.toString()}`
        );
        const data = await response.json();
        setItems(data.items);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, [statusFilter, riskFilter, tagFilter]);

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    setChangingStatus(itemId);
    try {
      const response = await fetch(`/api/reviewer/items/${itemId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setChangingStatus(null);
    }
  };

  const getRiskColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score <= 30) return "text-green-400";
    if (score <= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskLabel = (score: number | null) => {
    if (score === null) return "N/A";
    if (score <= 30) return "Low";
    if (score <= 60) return "Medium";
    return "High";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "IN_REVIEW":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "APPROVED":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ");
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
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
            <h1 className="text-3xl font-bold mb-2">Review Items</h1>
            <p className="text-gray-400">
              Manage and review all submitted items
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                disabled={isLoading}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="">All</option>
                <option value="NEW">New</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Risk Score
              </label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                disabled={isLoading}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="">All</option>
                <option value="low">Low (0-30)</option>
                <option value="medium">Medium (31-60)</option>
                <option value="high">High (61-100)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tag</label>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                disabled={isLoading}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="">All</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <p className="text-gray-400">Loading items...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <h2 className="text-xl font-bold mb-2">No items found</h2>
            <p className="text-gray-400">
              {statusFilter || riskFilter || tagFilter
                ? "Try adjusting your filters"
                : "No items have been submitted yet"}
            </p>
          </div>
        )}

        {/* Items List */}
        {!isLoading && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a1a1a] rounded-lg border border-[#333] p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="sm:ml-4 sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">
                      {formatAmount(item.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    {/* Current Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {formatStatus(item.status)}
                    </span>

                    {/* Risk Score */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Risk:</span>
                      <span
                        className={`font-bold ${getRiskColor(item.risk_score)}`}
                      >
                        {item.risk_score ?? "N/A"} / 100
                      </span>
                      <span
                        className={`text-xs ${getRiskColor(item.risk_score)}`}
                      >
                        ({getRiskLabel(item.risk_score)})
                      </span>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>by</span>
                      <span className="text-gray-300">
                        @{item.user.username}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag.name}
                          className="px-3 py-1 rounded-full text-xs font-medium border"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            borderColor: tag.color,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Status Change Dropdown */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#333]">
                    <label className="text-sm text-gray-400">
                      Change Status:
                    </label>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      disabled={changingStatus === item.id}
                      className="bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <option value="NEW" disabled={item.status === "NEW"}>
                        {item.status === "NEW" ? "✓ " : ""}New
                      </option>
                      <option
                        value="IN_REVIEW"
                        disabled={item.status === "IN_REVIEW"}
                      >
                        {item.status === "IN_REVIEW" ? "✓ " : ""}In Review
                      </option>
                      <option
                        value="APPROVED"
                        disabled={item.status === "APPROVED"}
                      >
                        {item.status === "APPROVED" ? "✓ " : ""}Approved
                      </option>
                      <option
                        value="REJECTED"
                        disabled={item.status === "REJECTED"}
                      >
                        {item.status === "REJECTED" ? "✓ " : ""}Rejected
                      </option>
                    </select>
                    {changingStatus === item.id && (
                      <span className="text-xs text-gray-400">Updating...</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
