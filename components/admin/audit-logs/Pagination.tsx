type PaginationProps = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  limit,
  totalCount,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-6 bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalCount)} of {totalCount} audit logs
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="px-3 py-1 bg-[#0a0a0a] border border-[#333] rounded-lg hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            First
          </button>

          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-[#0a0a0a] border border-[#333] rounded-lg hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-gray-400">Page</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={page}
              onChange={(e) => {
                const newPage = parseInt(e.target.value);
                if (newPage >= 1 && newPage <= totalPages) {
                  onPageChange(newPage);
                }
              }}
              className="w-16 px-2 py-1 bg-[#0a0a0a] border border-[#333] rounded text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-sm text-gray-400">of {totalPages}</span>
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-[#0a0a0a] border border-[#333] rounded-lg hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-[#0a0a0a] border border-[#333] rounded-lg hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
