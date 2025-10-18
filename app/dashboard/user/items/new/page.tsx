"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ItemForm from "@/components/user/ItemForm";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!title || !description || !amount || selectedTagIds.length === 0) {
        setMessage({
          status: "error",
          text: "Please fill in all fields and select at least one tag",
        });
        setIsSubmitting(false);
        return;
      }

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

      setMessage({ status: "success", text: "Item created successfully!" });
      setTimeout(() => {
        router.push("/dashboard/user/items");
      }, 1500);
    } catch (error) {
      setMessage({
        status: "error",
        text: "An error occurred. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/user/items");
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit New Item</h1>
          <p className="text-gray-400">Create a new deal or issue for review</p>
        </div>

        <ItemForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          amount={amount}
          setAmount={setAmount}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
          tags={tags}
          isLoadingTags={isLoadingTags}
          isSubmitting={isSubmitting}
          message={message}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </main>
  );
}
