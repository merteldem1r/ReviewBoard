"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Tag {
  id: string;
  name: string;
  risk_score: number;
  color: string;
}

export default function NewItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  // Fetch tags on mount
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch("/api/tags");
        const data = await response.json();
        setTags(data.tags);
      } catch (error) {
        setMessage({ status: "error", text: "Failed to load tags" });
      } finally {
        setIsLoadingTags(false);
      }
    }
    fetchTags();
  }, []);

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Validate
      if (!title || !description || !amount || selectedTagIds.length === 0) {
        setMessage({
          status: "error",
          text: "Please fill in all fields and select at least one tag",
        });
        setIsSubmitting(false);
        return;
      }

      // Create item
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          amount: parseFloat(amount),
          tagIds: selectedTagIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({
          status: "error",
          text: data.error || "Failed to create item",
        });
        setIsSubmitting(false);
        return;
      }

      // Success - redirect to items list
      setMessage({ status: "success", text: "Item created successfully!" });
      setTimeout(() => {
        router.push("/dashboard/items");
      }, 1500);
    } catch (error) {
      setMessage({
        status: "error",
        text: "An error occurred. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit New Item</h1>
          <p className="text-gray-400">Create a new deal or issue for review</p>
        </div>

        {/* Form */}
        <div className="bg-[#1a1a1a] rounded-lg shadow-xl border border-[#333] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AI Startup Funding Request"
                required
                disabled={isSubmitting}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information about the deal or issue..."
                required
                rows={5}
                disabled={isSubmitting}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 resize-none"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  disabled={isSubmitting}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg pl-8 pr-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags <span className="text-red-500">*</span>
              </label>
              {isLoadingTags ? (
                <div className="bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-8 text-center text-gray-400">
                  Loading tags...
                </div>
              ) : (
                <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 cursor-pointer ${
                          selectedTagIds.includes(tag.id)
                            ? "border-2"
                            : "border border-[#444] hover:border-[#666]"
                        }`}
                        style={{
                          backgroundColor: selectedTagIds.includes(tag.id)
                            ? `${tag.color}20`
                            : "transparent",
                          borderColor: selectedTagIds.includes(tag.id)
                            ? tag.color
                            : undefined,
                          color: selectedTagIds.includes(tag.id)
                            ? tag.color
                            : "#999",
                        }}
                      >
                        {tag.name}
                        {selectedTagIds.includes(tag.id) && " ✓"}
                      </button>
                    ))}
                  </div>
                  {selectedTagIds.length === 0 && (
                    <p className="text-sm text-gray-500 mt-3">
                      Select at least one tag
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  message.status === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={
                  isLoadingTags || isSubmitting || selectedTagIds.length === 0
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Creating..." : "Create Item"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/items")}
                disabled={isSubmitting}
                className="px-6 bg-[#0a0a0a] hover:bg-black border border-[#333] text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
