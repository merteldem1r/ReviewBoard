import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function ItemStats() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let stats = {
    totalItems: 0,
    pendingReview: 0,
    approved: 0,
  };

  if (userId) {
    const [totalItems, pendingReview, approved] = await Promise.all([
      prisma.item.count({
        where: { user_id: userId },
      }),
      prisma.item.count({
        where: {
          user_id: userId,
          status: {
            in: ["NEW", "IN_REVIEW"],
          },
        },
      }),
      prisma.item.count({
        where: {
          user_id: userId,
          status: "APPROVED",
        },
      }),
    ]);

    stats = { totalItems, pendingReview, approved };
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
        <div className="text-gray-400 text-sm mb-1">Total Items</div>
        <div className="text-3xl font-bold">{stats.totalItems}</div>
      </div>
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
        <div className="text-gray-400 text-sm mb-1">Pending Review</div>
        <div className="text-3xl font-bold text-yellow-400">
          {stats.pendingReview}
        </div>
      </div>
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
        <div className="text-gray-400 text-sm mb-1">Approved</div>
        <div className="text-3xl font-bold text-green-400">{stats.approved}</div>
      </div>
    </div>
  );
}