interface AmountRuleConfigProps {
  minAmount: string;
  maxAmount: string;
  score: string;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
  disabled?: boolean;
}

export default function AmountRuleConfig({
  minAmount,
  maxAmount,
  score,
  onMinAmountChange,
  onMaxAmountChange,
  disabled = false,
}: AmountRuleConfigProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 mb-4">
        This rule will trigger when an item's amount falls within the specified
        range.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Min Amount <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={minAmount}
            onChange={(e) => onMinAmountChange(e.target.value)}
            required
            step="0.01"
            disabled={disabled}
            placeholder="0.00"
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Max Amount <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => onMaxAmountChange(e.target.value)}
            required
            step="0.01"
            disabled={disabled}
            placeholder="10000.00"
            className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
          />
        </div>
      </div>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          <strong>Example:</strong> Min: 1000, Max: 5000 will add {score}{" "}
          points to items with amounts between $1,000 and $5,000.
        </p>
      </div>
    </div>
  );
}
