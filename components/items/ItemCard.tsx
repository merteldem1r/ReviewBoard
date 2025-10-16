import { User } from "@prisma/client";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  amount: string;
  tags: Tag[];
  status: string;
  risk_score: number | null;
  created_at: string;
  user: User;
}

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const getRiskColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score <= 30) return "text-green-400";
    if (score <= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskLabel = (score: number | null) => {
    if (score === null) return "N/A";
    if (score <= 30) return "Low";
    if (score <= 60) return "Medium";
    return "High";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "IN_REVIEW":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "APPROVED":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ");
  };

  const formatAmount = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="block bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#444] p-4 sm:p-6 transition-all">
      {/* TODO: Create item detail page at /dashboard/user/items/[id] */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {item.description}
          </p>
        </div>
        <div className="sm:ml-4 sm:text-right">
          <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">
            {formatAmount(item.amount)}
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(item.created_at)}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              item.status
            )}`}
          >
            {formatStatus(item.status)}
          </span>

          {/* Risk Score */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Risk:</span>
            <span className={`font-bold ${getRiskColor(item.risk_score)}`}>
              {item.risk_score ?? "N/A"} / 100
            </span>
            <span className={`text-xs ${getRiskColor(item.risk_score)}`}>
              ({getRiskLabel(item.risk_score)})
            </span>
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>by</span>
            <span className="text-gray-300">@{item.user.username}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => {
            return (
              <span
                key={tag.name}
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: tag ? `${tag.color}20` : "#33333320",
                  borderColor: tag?.color || "#333",
                  color: tag?.color || "#999",
                }}
              >
                {tag.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
