import { authOptions } from "@/lib/auth";
import { calculateRiskScore } from "@/lib/items/risk-calculator";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export interface TagNameRiskScore {
  name: string;
  risk_score: number;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, amount, tagIds } = await req.json();

    // Validate input
    if (
      !title ||
      !description ||
      !amount ||
      !tagIds ||
      !Array.isArray(tagIds)
    ) {
      return NextResponse.json(
        { error: "Title, description, amount, and tagIds are required" },
        { status: 400 }
      );
    }

    if (tagIds.length === 0) {
      return NextResponse.json(
        { error: "At least one tag is required" },
        { status: 400 }
      );
    }

    // Fetch the selected tags to get their names for risk calculation
    const selectedTags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
        is_active: true,
      },
    });

    if (selectedTags.length === 0) {
      return NextResponse.json(
        { error: "Invalid tag IDs provided" },
        { status: 400 }
      );
    }

    // tag names and risk_score of each
    const tagNamesRiskScore: TagNameRiskScore[] = selectedTags.map((tag) => ({
      name: tag.name,
      risk_score: tag.score,
    }));

    // risk score
    let totalScore: number;
    try {
      const scoreResult = await calculateRiskScore({
        amount: parseFloat(amount),
        tagNamesRiskScore,
      });
      totalScore = scoreResult.totalScore;
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to calculate risk score" },
        { status: 500 }
      );
    }

    // item create
    const item = await prisma.item.create({
      data: {
        title,
        description,
        amount: parseFloat(amount),
        risk_score: totalScore,
        status: "NEW",
        user_id: session.user.id,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true,
          },
        },
        tags: {
          select: {
            name: true,
            color: true,
          },
        },
      },
    });

    // audit log
    const tagNames = selectedTags.map((tag) => {
      return tag.name;
    });

    await prisma.auditLog.create({
      data: {
        action_type: "CREATED",
        item_id: item.id,
        user_id: session.user.id,
        old_value: undefined,
        new_value: JSON.stringify({
          title: item.title,
          status: "NEW",
          risk_score: totalScore,
          tag_names: tagNames,
        }),
      },
    });

    return NextResponse.json(
      {
        item,
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
    const tagName = searchParams.get("tag");
    const minRisk = searchParams.get("minRisk");
    const maxRisk = searchParams.get("maxRisk");

    // filter
    const where: any = {
      user_id: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    // tag name
    if (tagName) {
      where.tags = {
        some: {
          name: tagName,
        },
      };
    }

    // risk filter
    if (minRisk || maxRisk) {
      where.risk_score = {};
      if (minRisk) where.risk_score.gte = parseInt(minRisk);
      if (maxRisk) where.risk_score.lte = parseInt(maxRisk);
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        user: {
          select: {
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
