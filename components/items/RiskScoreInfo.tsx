"use client";

import { useState } from "react";

export default function RiskScoreInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between hover:bg-[#222] transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">How are Risk Scores Calculated?</h2>
        </div>
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <div className="px-8 py-6 border-t border-[#333] space-y-6">
          {/* Introduction */}
          <div>
            <p className="text-gray-300 leading-relaxed">
              Our risk scoring system evaluates each item submission based on
              multiple factors to help reviewers prioritize their attention. The
              total risk score ranges from <strong>0 to 100</strong>, with
              higher scores indicating potentially higher risk.
            </p>
          </div>

          {/* Risk Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <h3 className="font-bold text-green-400">Low Risk</h3>
              </div>
              <p className="text-2xl font-bold text-green-400 mb-1">0 - 30</p>
              <p className="text-sm text-gray-400">
                Standard items with minimal risk factors
              </p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <h3 className="font-bold text-yellow-400">Medium Risk</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-400 mb-1">31 - 60</p>
              <p className="text-sm text-gray-400">
                Items requiring careful review
              </p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <h3 className="font-bold text-red-400">High Risk</h3>
              </div>
              <p className="text-2xl font-bold text-red-400 mb-1">61 - 100</p>
              <p className="text-sm text-gray-400">
                Priority items needing thorough evaluation
              </p>
            </div>
          </div>

          {/* Calculation Factors */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              Calculation Factors (Cumulative):
            </h3>
            <div className="space-y-4">
              {/* Tags */}
              <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold mb-2 text-purple-400">
                      Predefined Tag Scores
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Each tag assigned to your item contributes a specific risk
                      score. Multiple tags are cumulative.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs">
                        Example: AI (+30 points)
                      </span>
                      <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-xs">
                        Example: Hardware (+20 points)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Rules */}
              <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold mb-2 text-blue-400">
                      Custom Amount-Based Rules
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Transaction, which amounts is in the certain{" "}
                      <b>min-max</b> range automatically increase the risk
                      score.
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>
                        • Amount rules are configured by administrators
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Rules */}
              <div className="bg-[#0a0a0a] border border-[#333] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold mb-2 text-yellow-400">
                      Custom Tag-Based Rules
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Specific tags or groups of tags can trigger additional
                      risk score increases.
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>
                        • Tag rules are configured by administrators
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="text-sm text-gray-500 italic text-center pt-4 border-t border-[#333]">
            Risk scores are automatically calculated and cannot be manually
            adjusted.
          </div>
        </div>
      </div>
    </div>
  );
}
