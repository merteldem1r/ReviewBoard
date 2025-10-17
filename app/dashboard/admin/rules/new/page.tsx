"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RuleBasicInfo from "@/components/admin/rules/RuleBasicInfo";
import RuleTypeSelector from "@/components/admin/rules/RuleTypeSelector";
import AmountRuleConfig from "@/components/admin/rules/AmountRuleConfig";
import TagRuleConfig from "@/components/admin/rules/TagRuleConfig";

interface Tag {
  id: string;
  name: string;
  color: string;
  is_active: boolean;
}

type RuleType = "AMOUNT_RULE" | "TAG_RULE";

export default function NewRulePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ruleType, setRuleType] = useState<RuleType>("AMOUNT_RULE");
  const [score, setScore] = useState("10");

  // Amount rule fields
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // Tag rule fields
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/admin/tags");
      const data = await response.json();
      setTags(data.tags.filter((tag: Tag) => tag.is_active));
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Build condition based on rule type
      let condition: any;

      if (ruleType === "AMOUNT_RULE") {
        if (!minAmount || !maxAmount) {
          alert("Please enter both min and max amounts");
          setIsLoading(false);
          return;
        }

        const min = parseFloat(minAmount);
        const max = parseFloat(maxAmount);

        if (isNaN(min) || isNaN(max)) {
          alert("Please enter valid numbers for amounts");
          setIsLoading(false);
          return;
        }

        if (min >= max) {
          alert("Min amount must be less than max amount");
          setIsLoading(false);
          return;
        }

        condition = {
          min,
          max,
        };
      } else {
        // TAG_RULE
        if (selectedTags.length === 0) {
          alert("Please select at least one tag");
          setIsLoading(false);
          return;
        }
        condition = {
          tags: selectedTags,
        };
      }

      const response = await fetch("/api/admin/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || null,
          rule_type: ruleType,
          condition,
          score: parseInt(score),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create rule");
      }

      router.push("/dashboard/admin/rules");
    } catch (error) {
      console.error("Error creating rule:", error);
      alert(error instanceof Error ? error.message : "Failed to create rule");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Risk Rule</h1>
          <p className="text-gray-400">
            Define automated rules to calculate risk scores for items
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <RuleBasicInfo
            name={name}
            description={description}
            score={score}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onScoreChange={setScore}
            disabled={isLoading}
          />

          {/* Rule Type Selection */}
          <RuleTypeSelector
            selectedType={ruleType}
            onTypeChange={setRuleType}
            disabled={isLoading}
          />

          {/* Rule Configuration */}
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
            <h2 className="text-xl font-bold mb-4">Rule Configuration</h2>

            {ruleType === "AMOUNT_RULE" ? (
              <AmountRuleConfig
                minAmount={minAmount}
                maxAmount={maxAmount}
                score={score}
                onMinAmountChange={setMinAmount}
                onMaxAmountChange={setMaxAmount}
                disabled={isLoading}
              />
            ) : (
              <TagRuleConfig
                tags={tags}
                selectedTags={selectedTags}
                loadingTags={loadingTags}
                onTagToggle={handleTagToggle}
                disabled={isLoading}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Creating Rule..." : "Create Rule"}
            </button>
            <Link
              href="/dashboard/admin/rules"
              className="flex-1 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white font-medium py-3 rounded-lg transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
