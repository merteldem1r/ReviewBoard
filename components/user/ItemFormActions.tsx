interface ItemFormActionsProps {
  isLoadingTags: boolean;
  isSubmitting: boolean;
  selectedTagIds: string[];
  onCancel: () => void;
}

export default function ItemFormActions({
  isLoadingTags,
  isSubmitting,
  selectedTagIds,
  onCancel,
}: ItemFormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="submit"
        disabled={isLoadingTags || isSubmitting || selectedTagIds.length === 0}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? "Creating..." : "Create Item"}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting}
        className="px-6 bg-[#0a0a0a] hover:bg-black border border-[#333] text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
}
