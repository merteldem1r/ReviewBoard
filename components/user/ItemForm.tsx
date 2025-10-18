"use client";

import { FormEvent } from "react";
import RiskCalculationLoading from "@/components/skeletons/RiskCalculationLoading";
import ItemFormFields from "./ItemFormFields";
import ItemFormActions from "./ItemFormActions";

interface Tag {
  id: string;
  name: string;
  risk_score: number;
  color: string;
}

interface ItemFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  selectedTagIds: string[];
  setSelectedTagIds: (value: string[]) => void;
  tags: Tag[];
  isLoadingTags: boolean;
  isSubmitting: boolean;
  message: {
    status: "success" | "error";
    text: string;
  } | null;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}

export default function ItemForm({
  title,
  setTitle,
  description,
  setDescription,
  amount,
  setAmount,
  selectedTagIds,
  setSelectedTagIds,
  tags,
  isLoadingTags,
  isSubmitting,
  message,
  onSubmit,
  onCancel,
}: ItemFormProps) {
  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(
      selectedTagIds.includes(tagId)
        ? selectedTagIds.filter((id) => id !== tagId)
        : [...selectedTagIds, tagId]
    );
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg shadow-xl border border-[#333] p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        {!isSubmitting && (
          <ItemFormFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            selectedTagIds={selectedTagIds}
            tags={tags}
            isLoadingTags={isLoadingTags}
            isSubmitting={isSubmitting}
            onTagToggle={handleTagToggle}
          />
        )}

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

        {/* Risk Score Calculation Loading */}
        {isSubmitting && <RiskCalculationLoading />}

        <ItemFormActions
          isLoadingTags={isLoadingTags}
          isSubmitting={isSubmitting}
          selectedTagIds={selectedTagIds}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}
