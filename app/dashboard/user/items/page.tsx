"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@prisma/client";
import ItemCard from "@/components/items/ItemCard";

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

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        // Build query params
        const params = new URLSearchParams();
        if (statusFilter) params.append("status", statusFilter);
        if (tagFilter) params.append("tag", tagFilter);

        // Add risk score range
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

        const response = await fetch(`/api/items?${params.toString()}`);
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

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Items</h1>
            <p className="text-gray-400">Manage and review submitted deals</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all text-center"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/user/items/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-center"
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
              <select
                value={statusFilter}
                disabled={isLoading}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="">All</option>
                {tags ? (
                  tags.map((tag) => (
                    <option key={tag.id} value={tag.name}>
                      {tag.name}
                    </option>
                  ))
                ) : (
                  <></>
                )}
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
            <p className="text-gray-400 mb-6">
              {statusFilter || riskFilter || tagFilter
                ? "Try adjusting your filters"
                : "Get started by creating your first item for review"}
            </p>
            <Link
              href="/dashboard/user/items/new"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              Create First Item
            </Link>
          </div>
        )}

        {/* Items List */}
        {!isLoading && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
