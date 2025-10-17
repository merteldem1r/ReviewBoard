"use client";

import { useEffect, useState } from "react";

type AuditLog = {
  id: string;
  action_type: "CREATED" | "STATUS_CHANGED" | "STATUS_CHANGED_BY_SYSTEM" | "UPDATED";
  old_value: any;
  new_value: any;
  created_at: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  item: {
    id: string;
    title: string;
    status: string;
  };
};

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionTypeFilter, setActionTypeFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    fetchAuditLogs();
  }, [actionTypeFilter, page, limit]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (actionTypeFilter !== "all") {
        params.append("actionType", actionTypeFilter);
      }
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const response = await fetch(`/api/admin/audit-logs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch audit logs");
      const data = await response.json();
      setAuditLogs(data.auditLogs);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
  };

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case "CREATED":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "STATUS_CHANGED":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "STATUS_CHANGED_BY_SYSTEM":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "UPDATED":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const formatActionType = (actionType: string) => {
    return actionType.replace(/_/g, " ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const renderValueChange = (log: AuditLog) => {
    if (log.action_type === "CREATED") {
      return (
        <div className="text-sm text-gray-400">
          Item created with status: <span className="text-green-400 font-medium">{log.new_value?.status || "NEW"}</span>
        </div>
      );
    }

    if (log.action_type === "STATUS_CHANGED" || log.action_type === "STATUS_CHANGED_BY_SYSTEM") {
      return (
        <div className="text-sm text-gray-400">
          Status changed from{" "}
          <span className="text-red-400 font-medium">{log.old_value?.status || "N/A"}</span>
          {" → "}
          <span className="text-green-400 font-medium">{log.new_value?.status || "N/A"}</span>
          {log.action_type === "STATUS_CHANGED_BY_SYSTEM" && (
            <span className="ml-2 text-xs text-yellow-400">(Automated)</span>
          )}
        </div>
      );
    }

    if (log.action_type === "UPDATED") {
      return (
        <div className="text-sm text-gray-400">
          <div>Item updated</div>
          {log.old_value && log.new_value && (
            <div className="mt-2 space-y-1 text-xs">
              {Object.keys(log.new_value).map((key) => {
                if (log.old_value?.[key] !== log.new_value?.[key]) {
                  return (
                    <div key={key} className="flex gap-2">
                      <span className="text-gray-500 capitalize">{key}:</span>
                      <span className="text-red-400">{String(log.old_value?.[key] || "N/A")}</span>
                      <span>→</span>
                      <span className="text-green-400">{String(log.new_value?.[key] || "N/A")}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
          <p className="text-gray-400">
            View all system activity and changes to items
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">
                Action Type
              </label>
              <select
                value={actionTypeFilter}
                onChange={(e) => {
                  setActionTypeFilter(e.target.value);
                  setPage(1); // Reset to first page when filter changes
                }}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Actions</option>
                <option value="CREATED">Created</option>
                <option value="STATUS_CHANGED">Status Changed (Manual)</option>
                <option value="STATUS_CHANGED_BY_SYSTEM">Status Changed (System)</option>
                <option value="UPDATED">Updated</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">
                Items Per Page
              </label>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(parseInt(e.target.value))}
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

        {/* Audit Logs List */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333]">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              Loading audit logs...
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No audit logs found
            </div>
          ) : (
            <div className="divide-y divide-[#333]">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-[#222] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Action Type Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionTypeColor(
                            log.action_type
                          )}`}
                        >
                          {formatActionType(log.action_type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.created_at)}
                        </span>
                      </div>

                      {/* Item Info */}
                      <div className="mb-2">
                        <span className="text-sm text-gray-400">Item: </span>
                        <span className="text-sm font-medium">
                          {log.item.title}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          (ID: {log.item.id})
                        </span>
                      </div>

                      {/* Value Changes */}
                      {renderValueChange(log)}

                      {/* User Info */}
                      <div className="mt-3 pt-3 border-t border-[#333]">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Performed by:</span>
                          {log.action_type === "STATUS_CHANGED_BY_SYSTEM" ? (
                            <>
                              <span className="text-gray-300">System</span>
                              <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-400">
                                SYSTEM
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-300">
                                {log.user.username}
                              </span>
                              <span className="text-gray-600">({log.user.email})</span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                  log.user.role === "ADMIN"
                                    ? "bg-purple-500/10 text-purple-400"
                                    : log.user.role === "REVIEWER"
                                    ? "bg-blue-500/10 text-blue-400"
                                    : "bg-gray-500/10 text-gray-400"
                                }`}
                              >
                                {log.user.role}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && auditLogs.length > 0 && (
          <div className="mt-6 bg-[#1a1a1a] rounded-lg border border-[#333] p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} audit logs
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1}
                  className="px-3 py-1 bg-[#0a0a0a] border border-[#333] rounded-lg hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  First
                </button>
                
                <button
                  onClick={() => handlePageChange(page - 1)}
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
                        setPage(newPage);
                      }
                    }}
                    className="w-16 px-2 py-1 bg-[#0a0a0a] border border-[#333] rounded text-center focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-400">of {totalPages}</span>
                </div>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-[#0a0a0a] border border-[#333] rounded-lg hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
                
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-[#0a0a0a] border border-[#333] rounded-lg hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
