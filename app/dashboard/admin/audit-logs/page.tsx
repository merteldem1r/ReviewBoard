"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuditLogFilters from "@/components/admin/audit-logs/AuditLogFilters";
import AuditLogItem from "@/components/admin/audit-logs/AuditLogItem";
import Pagination from "@/components/admin/audit-logs/Pagination";

type AuditLog = {
  id: string;
  action_type:
    | "CREATED"
    | "STATUS_CHANGED"
    | "STATUS_CHANGED_BY_SYSTEM"
    | "UPDATED";
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

  const handleActionTypeChange = (value: string) => {
    setActionTypeFilter(value);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
            <p className="text-gray-400">
              View all system activity and changes to items
            </p>
          </div>
          <div>
            <Link
              href="/dashboard/admin"
              className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-all text-center"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Filters */}
        <AuditLogFilters
          actionTypeFilter={actionTypeFilter}
          limit={limit}
          onActionTypeChange={handleActionTypeChange}
          onLimitChange={handleLimitChange}
        />

        {/* Audit Logs List */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333] mt-6">
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
                <AuditLogItem key={log.id} log={log} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && auditLogs.length > 0 && (
          <Pagination
            page={page}
            limit={limit}
            totalCount={totalCount}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
