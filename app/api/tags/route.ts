import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        score: true,
        name: true,
        color: true,
      },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Fetch tags error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
