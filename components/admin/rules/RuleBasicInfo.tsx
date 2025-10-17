interface RuleBasicInfoProps {
  name: string;
  description: string;
  score: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onScoreChange: (value: string) => void;
  disabled?: boolean;
}

export default function RuleBasicInfo({
  name,
  description,
  score,
  onNameChange,
  onDescriptionChange,
  onScoreChange,
  disabled = false,
}: RuleBasicInfoProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6">
      <h2 className="text-xl font-bold mb-4">Basic Information</h2>
      <div className="space-y-4">
        {/* Rule Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rule Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
            disabled={disabled}
            placeholder="e.g., High Value Transactions"
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            disabled={disabled}
            placeholder="Describe when this rule should apply..."
            rows={3}
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
          />
        </div>

        {/* Score */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Risk Score <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={score}
            onChange={(e) => onScoreChange(e.target.value)}
            required
            min="0"
            max="100"
            disabled={disabled}
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Points to add to item's risk score (0-100)
          </p>
        </div>
      </div>
    </div>
  );
}
