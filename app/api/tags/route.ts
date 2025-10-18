import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redis, CACHE_TTL } from "@/lib/redis/redis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    // redis caching
    const cacheKey =
      userRole === "ADMIN" ? "tags:admin:all" : "tags:user:active";
    const cachedTags = await redis.get(cacheKey);

    if (cachedTags) {
      console.log(`Cache HIT for tags (role: ${userRole})`);

      return NextResponse.json(
        { tags: cachedTags, cached: true },
        {
          status: 200,
          headers: {
            "X-Cache-Status": "HIT",
          },
        }
      );
    }

    console.log(`Cache MISS for tags (role: ${userRole})`);

    let tags;
    if (userRole === "ADMIN") {
      tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    } else {
      tags = await prisma.tag.findMany({
        where: {
          is_active: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    }

    // cache results
    await redis.set(cacheKey, tags, { ex: CACHE_TTL.TAGS });

    return NextResponse.json(
      { tags, cached: false },
      {
        status: 200,
        headers: {
          "X-Cache-Status": "MISS",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
