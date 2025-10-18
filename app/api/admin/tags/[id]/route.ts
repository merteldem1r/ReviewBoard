import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis/redis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: tagId } = await params;

    const { name, score, color, is_active } = body;

    // Validate score if provided
    if (score !== undefined && (score < 0 || score > 100)) {
      return NextResponse.json(
        { error: "Score must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (score !== undefined) updateData.score = score;
    if (color !== undefined) updateData.color = color;
    if (is_active !== undefined) updateData.is_active = is_active;

    const tag = await prisma.tag.update({
      where: { id: tagId },
      data: updateData,
    });

    // Invalidate both admin and user tag caches
    await redis.del("tags:admin:all");
    await redis.del("tags:user:active");

    return NextResponse.json({ tag });
  } catch (error) {
    console.error("Failed to update tag:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is ADMIN
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: tagId } = await params;

    // Check if tag is being used
    const tagWithItems = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    if (tagWithItems && tagWithItems._count.items > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete tag. It is being used by ${tagWithItems._count.items} items. Deactivate it instead.`,
        },
        { status: 400 }
      );
    }

    await prisma.tag.delete({
      where: { id: tagId },
    });

    // Invalidate both admin and user tag caches
    await redis.del("tags:admin:all");
    await redis.del("tags:user:active");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
