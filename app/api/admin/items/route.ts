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
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const minRisk = searchParams.get("minRisk");
    const maxRisk = searchParams.get("maxRisk");
    const is_active = searchParams.get("is_active");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      };
    }

    if (minRisk !== null && maxRisk !== null) {
      where.risk_score = {
        gte: parseInt(minRisk || "0"),
        lte: parseInt(maxRisk || "100"),
      };
    }

    if (is_active !== null) {
      where.is_active = is_active === "true";
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
