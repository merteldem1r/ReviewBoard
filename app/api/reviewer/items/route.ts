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

    // Check if user is REVIEWER or ADMIN
    if (session.user.role !== "REVIEWER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tagName = searchParams.get("tag");
    const minRisk = searchParams.get("minRisk");
    const maxRisk = searchParams.get("maxRisk");

    // Build filter
    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Filter by tag name using relation
    if (tagName) {
      where.tags = {
        some: {
          name: tagName,
        },
      };
    }

    if (minRisk || maxRisk) {
      where.risk_score = {};
      if (minRisk) where.risk_score.gte = parseInt(minRisk);
      if (maxRisk) where.risk_score.lte = parseInt(maxRisk);
    }

    // Fetch ALL items (not filtered by user) for reviewers
    const items = await prisma.item.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Fetch items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
