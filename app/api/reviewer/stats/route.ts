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

    // Check if user is REVIEWER or ADMIN
    if (session.user.role !== "REVIEWER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch reviewer statistics
    const [
      totalUsers,
      totalItems,
      pendingReviewItems,
      approvedItems,
      rejectedItems,
      activeTags,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.item.count(),
      prisma.item.count({
        where: {
          status: {
            in: ["NEW", "IN_REVIEW"],
          },
        },
      }),
      prisma.item.count({
        where: { status: "APPROVED" },
      }),
      prisma.item.count({
        where: { status: "REJECTED" },
      }),
      prisma.tag.count({
        where: { is_active: true },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalItems,
      pendingReviewItems,
      approvedItems,
      rejectedItems,
      activeTags,
    });
  } catch (error) {
    console.error("Failed to fetch reviewer stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
