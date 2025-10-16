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
            <h1 className="text-3xl font-bold mb-2">Risk Rules Management</h1>
            <p className="text-gray-400">
              View and manage risk calculation rules
            </p>
          </div>
          <Link
            href="/dashboard/admin"
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all text-center"
          >
            ← Back to Admin Dashboard
          </Link>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-blue-400 mb-2">📖 About Risk Rules</h3>
          <p className="text-sm text-gray-300">
            Risk rules are automatically calculated based on item properties. Rules
            can be activated or deactivated, but cannot be edited or deleted to
            maintain data integrity and audit trail consistency.
          </p>
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
                      onClick={() => handleToggleActive(rule)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        rule.is_active
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {rule.is_active ? "Deactivate" : "Activate"}
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
