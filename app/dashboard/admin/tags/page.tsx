"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Tag {
  id: string;
  name: string;
  score: number;
  color: string;
  is_active: boolean;
  _count: {
    items: number;
  };
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    score: 0,
    color: "#6B7280",
    is_active: true,
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/tags");
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create tag");
      }

      setShowCreateForm(false);
      setFormData({ name: "", score: 0, color: "#6B7280", is_active: true });
      fetchTags();
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Failed to create tag");
    }
  };

  const handleUpdate = async (tagId: string, updates: Partial<Tag>) => {
    setEditingTag(tagId);
    try {
      const response = await fetch(`/api/admin/tags/${tagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update tag");
      }

      fetchTags();
    } catch (error) {
      console.error("Error updating tag:", error);
      alert("Failed to update tag");
    } finally {
      setEditingTag(null);
    }
  };

  const handleToggleActive = async (tag: Tag) => {
    await handleUpdate(tag.id, { is_active: !tag.is_active });
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tags Management</h1>
            <p className="text-gray-400">
              Manage tags and configure risk scores
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              {showCreateForm ? "Cancel" : "+ Create Tag"}
            </button>
            <Link
              href="/dashboard/admin"
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all text-center"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <form
            onSubmit={handleCreate}
            className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 mb-6"
          >
            <h3 className="text-lg font-bold mb-4">Create New Tag</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g., High Value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Risk Score
                </label>
                <input
                  type="number"
                  value={formData.score}
                  onChange={(e) =>
                    setFormData({ ...formData, score: parseInt(e.target.value) })
                  }
                  required
                  min="0"
                  max="100"
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-full h-10 bg-[#0a0a0a] border border-[#333] rounded-lg px-2 py-1"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                >
                  Create Tag
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <p className="text-gray-400">Loading tags...</p>
          </div>
        )}

        {/* Tags Table */}
        {!isLoading && tags.length > 0 && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-[#333]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Tag Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Color
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Usage
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333]">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-[#0a0a0a]/50">
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium border"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            borderColor: tag.color,
                            color: tag.color,
                          }}
                        >
                          {tag.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={tag.score}
                          onChange={(e) =>
                            handleUpdate(tag.id, {
                              score: parseInt(e.target.value),
                            })
                          }
                          disabled={editingTag === tag.id}
                          min="0"
                          max="100"
                          className="w-20 bg-[#0a0a0a] border border-[#333] rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="color"
                          value={tag.color}
                          onChange={(e) =>
                            handleUpdate(tag.id, { color: e.target.value })
                          }
                          disabled={editingTag === tag.id}
                          className="w-12 h-8 bg-[#0a0a0a] border border-[#333] rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {tag._count.items} items
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            tag.is_active
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }`}
                        >
                          {tag.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(tag)}
                          disabled={editingTag === tag.id}
                          className="px-3 py-1 bg-[#0a0a0a] hover:bg-[#222] border border-[#333] text-white rounded text-sm transition-all disabled:opacity-50"
                        >
                          {tag.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tags.length === 0 && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <h2 className="text-xl font-bold mb-2">No tags found</h2>
            <p className="text-gray-400">Create your first tag to get started</p>
          </div>
        )}
      </div>
    </main>
  );
}
