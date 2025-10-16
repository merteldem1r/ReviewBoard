import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Cache tags for 5 minutes (they don't change often)
export const revalidate = 300;

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

    return NextResponse.json(
      { tags },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Fetch tags error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
