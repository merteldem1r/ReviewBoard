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

    const rules = await prisma.rule.findMany({
      orderBy: [{ is_active: "desc" }, { rule_type: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ rules });
  } catch (error) {
    console.error("Failed to fetch rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch rules" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is ADMIN
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, rule_type, condition, score } = body;

    // Validation
    if (!name || !rule_type || !condition || score === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["AMOUNT_RULE", "TAG_RULE"].includes(rule_type)) {
      return NextResponse.json({ error: "Invalid rule type" }, { status: 400 });
    }

    if (score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Score must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Validate condition structure based on rule type
    if (rule_type === "AMOUNT_RULE") {
      if (
        !condition.min ||
        !condition.max ||
        isNaN(condition.min) ||
        isNaN(condition.max)
      ) {
        return NextResponse.json(
          { error: "Amount rule requires min and max" },
          { status: 400 }
        );
      }
    }

    if (rule_type === "TAG_RULE") {
      if (!condition.tags || !Array.isArray(condition.tags)) {
        return NextResponse.json(
          { error: "Tag rule requires tag_ids array" },
          { status: 400 }
        );
      }

      const providedTags = await prisma.tag.findMany({
        where: { is_active: true, id: { in: condition.tags } },
        select: { name: true },
      });

      const providedTagNames = providedTags.map((tag) => {
        return tag.name;
      });

      condition.tags = providedTagNames;
    }

    const rule = await prisma.rule.create({
      data: {
        name,
        description: description || null,
        rule_type,
        condition,
        score,
      },
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error("Failed to create rule:", error);
    return NextResponse.json(
      { error: "Failed to create rule" },
      { status: 500 }
    );
  }
}
