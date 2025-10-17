type AuditLogFiltersProps = {
  actionTypeFilter: string;
  limit: number;
  onActionTypeChange: (value: string) => void;
  onLimitChange: (value: number) => void;
};

export default function AuditLogFilters({
  actionTypeFilter,
  limit,
  onActionTypeChange,
  onLimitChange,
}: AuditLogFiltersProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Action Type</label>
          <select
            value={actionTypeFilter}
            onChange={(e) => onActionTypeChange(e.target.value)}
            className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Actions</option>
            <option value="CREATED">Created</option>
            <option value="STATUS_CHANGED">Status Changed (Manual)</option>
            <option value="STATUS_CHANGED_BY_SYSTEM">
              Status Changed (System)
            </option>
            <option value="UPDATED">Updated</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">
            Items Per Page
          </label>
          <select
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
