import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is ADMIN
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch admin statistics
    const [
      totalUsers,
      totalReviewers,
      totalAdmins,
      totalItems,
      pendingReviewItems,
      totalTags,
      activeTags,
      totalRules,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "REVIEWER" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.item.count(),
      prisma.item.count({
        where: {
          status: {
            in: ["NEW", "IN_REVIEW"],
          },
        },
      }),
      prisma.tag.count(),
      prisma.tag.count({ where: { is_active: true } }),
      prisma.rule.count(),
      prisma.auditLog.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalReviewers,
      totalAdmins,
      totalItems,
      pendingReviewItems,
      totalTags,
      activeTags,
      totalRules,
      recentAuditLogs,
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
