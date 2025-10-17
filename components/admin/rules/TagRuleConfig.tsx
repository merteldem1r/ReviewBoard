interface Tag {
  id: string;
  name: string;
  color: string;
  is_active: boolean;
}

interface TagRuleConfigProps {
  tags: Tag[];
  selectedTags: string[];
  loadingTags: boolean;
  onTagToggle: (tagId: string) => void;
  disabled?: boolean;
}

export default function TagRuleConfig({
  tags,
  selectedTags,
  loadingTags,
  onTagToggle,
  disabled = false,
}: TagRuleConfigProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400 mb-4">
        This rule will trigger when an item has the selected tag combination.
      </p>

      {/* Tag Selection */}
      {loadingTags ? (
        <div className="text-center py-8 text-gray-400">Loading tags...</div>
      ) : tags.length === 0 ? (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-yellow-400">
            No active tags found. Please create tags first before creating tag
            rules.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => onTagToggle(tag.id)}
                disabled={disabled}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedTags.includes(tag.id)
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-[#333] bg-[#0a0a0a] hover:border-[#555]"
                } disabled:opacity-50`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      selectedTags.includes(tag.id)
                        ? "border-purple-500 bg-purple-500"
                        : "border-[#555]"
                    }`}
                  >
                    {selectedTags.includes(tag.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium" style={{ color: tag.color }}>
                    {tag.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <p className="text-sm text-purple-400">
              <strong>Example:</strong> Selected tags: [
              {selectedTags.length > 0
                ? tags
                    .filter((t) => selectedTags.includes(t.id))
                    .map((t) => t.name)
                    .join(",")
                : "Empty"}
              ] | Will add points if this tag combination is presented on the new
              created item tags
            </p>
          </div>
        </>
      )}
    </div>
  );
}
