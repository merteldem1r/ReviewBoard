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

type AuditLogItemProps = {
  log: AuditLog;
};

function getActionTypeColor(actionType: string) {
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
}

function formatActionType(actionType: string) {
  return actionType.replace(/_/g, " ");
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function renderValueChange(log: AuditLog) {
  if (log.action_type === "CREATED") {
    return (
      <div className="text-sm text-gray-400">
        Item created with status:{" "}
        <span className="text-green-400 font-medium">
          {log.new_value?.status || "NEW"}
        </span>
      </div>
    );
  }

  if (
    log.action_type === "STATUS_CHANGED" ||
    log.action_type === "STATUS_CHANGED_BY_SYSTEM"
  ) {
    return (
      <div className="text-sm text-gray-400">
        Status changed from{" "}
        <span className="text-red-400 font-medium">
          {log.old_value?.status || "N/A"}
        </span>
        {" → "}
        <span className="text-green-400 font-medium">
          {log.new_value?.status || "N/A"}
        </span>
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
                    <span className="text-red-400">
                      {String(log.old_value?.[key] || "N/A")}
                    </span>
                    <span>→</span>
                    <span className="text-green-400">
                      {String(log.new_value?.[key] || "N/A")}
                    </span>
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
}

export default function AuditLogItem({ log }: AuditLogItemProps) {
  return (
    <div className="p-6 hover:bg-[#222] transition-colors">
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
            <span className="text-sm font-medium">{log.item.title}</span>
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
                  <span className="text-gray-300">{log.user.username}</span>
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
  );
}
