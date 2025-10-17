import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is ADMIN
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const actionType = searchParams.get("actionType");
    const userId = searchParams.get("userId");
    const itemId = searchParams.get("itemId");
    const limit = searchParams.get("limit");

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        ...(actionType && { action_type: actionType as any }),
        ...(userId && { user_id: userId }),
        ...(itemId && { item_id: itemId }),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
        item: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit ? parseInt(limit) : 100,
    });

    return NextResponse.json({ auditLogs });
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
