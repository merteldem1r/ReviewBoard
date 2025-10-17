"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Rule {
  id: string;
  name: string;
  description: string | null;
  rule_type: string;
  condition: any;
  score: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingRuleId, setUpdatingRuleId] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/rules");
      const data = await response.json();
      setRules(data.rules);
    } catch (error) {
      console.error("Failed to fetch rules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (rule: Rule) => {
    setUpdatingRuleId(rule.id);
    try {
      const response = await fetch(`/api/admin/rules/${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !rule.is_active }),
      });

      if (!response.ok) {
        throw new Error("Failed to update rule");
      }

      fetchRules();
    } catch (error) {
      console.error("Error updating rule:", error);
      alert("Failed to update rule");
    } finally {
      setUpdatingRuleId(null);
    }
  };

  const getRuleTypeLabel = (type: string) => {
    switch (type) {
      case "AMOUNT_RULE":
        return "Amount Rule";
      case "TAG_RULE":
        return "Tag Rule";
      default:
        return type;
    }
  };

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case "AMOUNT_RULE":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "TAG_RULE":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatCondition = (condition: any) => {
    return JSON.stringify(condition, null, 2);
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
            <h1 className="text-3xl font-bold mb-2">
              Custom Extra Rules Management
            </h1>
            <p className="text-gray-400">
              View and manage custom created risk calculation rules
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard/admin/rules/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-center cursor-pointer"
            >
              + Create Rule
            </Link>
            <Link
              href="/dashboard/admin"
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all text-center"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="font-bold text-yellow-400 mb-2">
                Important Notice
              </h3>
              <p className="text-sm text-gray-300">
                Remember that deactivating custom rules will not affect risk
                scores on items where those rules have already been applied.
                Risk scores are calculated at the time of item creation. To
                recalculate existing items, they must be manually updated.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <p className="text-gray-400">Loading rules...</p>
          </div>
        )}

        {/* Rules List */}
        {!isLoading && rules.length > 0 && (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{rule.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getRuleTypeColor(
                          rule.rule_type
                        )}`}
                      >
                        {getRuleTypeLabel(rule.rule_type)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          rule.is_active
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}
                      >
                        {rule.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {rule.description && (
                      <p className="text-gray-400 text-sm mb-3">
                        {rule.description}
                      </p>
                    )}
                    <div className="text-sm text-gray-500">
                      Created: {formatDate(rule.created_at)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-2xl font-bold text-yellow-400">
                      +{rule.score} points
                    </div>
                    <button
                      disabled={updatingRuleId === rule.id}
                      onClick={() => handleToggleActive(rule)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        rule.is_active
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {updatingRuleId === rule.id
                        ? "Updating..."
                        : rule.is_active
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </div>
                </div>

                {/* Condition Display */}
                <div className="mt-4 pt-4 border-t border-[#333]">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    Rule Condition:
                  </h4>
                  <pre className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 text-xs text-gray-300 overflow-x-auto">
                    {formatCondition(rule.condition)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && rules.length === 0 && (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-12 text-center">
            <h2 className="text-xl font-bold mb-2">No rules found</h2>
            <p className="text-gray-400">
              No risk calculation rules have been configured yet
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
