interface Tag {
  id: string;
  name: string;
  risk_score: number;
  color: string;
}

interface ItemFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  selectedTagIds: string[];
  tags: Tag[];
  isLoadingTags: boolean;
  isSubmitting: boolean;
  onTagToggle: (tagId: string) => void;
}

export default function ItemFormFields({
  title,
  setTitle,
  description,
  setDescription,
  amount,
  setAmount,
  selectedTagIds,
  tags,
  isLoadingTags,
  isSubmitting,
  onTagToggle,
}: ItemFormFieldsProps) {
  return (
    <>
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
                  onClick={() => onTagToggle(tag.id)}
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
                    color: selectedTagIds.includes(tag.id) ? tag.color : "#999",
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
    </>
  );
}
