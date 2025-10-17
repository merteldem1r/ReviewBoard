interface RuleTypeSelectorProps {
  selectedType: "AMOUNT_RULE" | "TAG_RULE";
  onTypeChange: (type: "AMOUNT_RULE" | "TAG_RULE") => void;
  disabled?: boolean;
}

export default function RuleTypeSelector({
  selectedType,
  onTypeChange,
  disabled = false,
}: RuleTypeSelectorProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
      <h2 className="text-xl font-bold mb-4">Rule Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount Rule */}
        <button
          type="button"
          onClick={() => onTypeChange("AMOUNT_RULE")}
          disabled={disabled}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedType === "AMOUNT_RULE"
              ? "border-blue-500 bg-blue-500/10"
              : "border-[#333] bg-[#0a0a0a] hover:border-[#555]"
          } disabled:opacity-50`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                selectedType === "AMOUNT_RULE"
                  ? "border-blue-500 bg-blue-500"
                  : "border-[#555]"
              }`}
            />
            <h3 className="font-bold text-blue-400">Amount Rule</h3>
          </div>
          <p className="text-sm text-gray-400">
            Trigger based on transaction amount ranges
          </p>
        </button>

        {/* Tag Rule */}
        <button
          type="button"
          onClick={() => onTypeChange("TAG_RULE")}
          disabled={disabled}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedType === "TAG_RULE"
              ? "border-purple-500 bg-purple-500/10"
              : "border-[#333] bg-[#0a0a0a] hover:border-[#555]"
          } disabled:opacity-50`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                selectedType === "TAG_RULE"
                  ? "border-purple-500 bg-purple-500"
                  : "border-[#555]"
              }`}
            />
            <h3 className="font-bold text-purple-400">Tag Rule</h3>
          </div>
          <p className="text-sm text-gray-400">
            Trigger based on specific tag combinations
          </p>
        </button>
      </div>
    </div>
  );
}
