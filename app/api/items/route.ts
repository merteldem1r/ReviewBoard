import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateRiskScore } from "@/lib/risk-calculator";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, amount, tags } = await req.json();

    // Validate input
    if (!title || !description || !amount || !tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Title, description, amount, and tags are required" },
        { status: 400 }
      );
    }

    if (tags.length === 0) {
      return NextResponse.json(
        { error: "At least one tag is required" },
        { status: 400 }
      );
    }

    // Calculate risk score
    const { totalScore, breakdown } = await calculateRiskScore({
      amount: parseFloat(amount),
      tags,
    });

    // Create item
    const item = await prisma.item.create({
      data: {
        title,
        description,
        amount: parseFloat(amount),
        tags,
        risk_score: totalScore,
        status: "NEW",
        created_by_id: session.user.id,
      },
      include: {
        created_by: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    // Create audit log for item creation
    await prisma.auditLog.create({
      data: {
        action_type: "CREATED",
        item_id: item.id,
        user_id: session.user.id,
        old_value: null,
        new_value: JSON.stringify({
          title: item.title,
          status: "NEW",
          risk_score: totalScore,
          breakdown,
        }),
      },
    });

    return NextResponse.json(
      {
        item,
        riskBreakdown: breakdown,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create item error:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const minRisk = searchParams.get("minRisk");
    const maxRisk = searchParams.get("maxRisk");

    // Build filter
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (minRisk || maxRisk) {
      where.risk_score = {};
      if (minRisk) where.risk_score.gte = parseInt(minRisk);
      if (maxRisk) where.risk_score.lte = parseInt(maxRisk);
    }

    // Fetch items
    const items = await prisma.item.findMany({
      where,
      include: {
        created_by: {
          select: {
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
    console.error("Fetch items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}
