import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is ADMIN
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status, itemId } = await req.json();

    // Validate status
    const validStatuses = ["NEW", "IN_REVIEW", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get the old item data for audit log
    const oldItem = await prisma.item.findUnique({
      where: { id: itemId },
      select: { status: true },
    });

    if (!oldItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Update item status
    const item = await prisma.item.update({
      where: { id: itemId },
      data: { status },
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
            username: true,
            email: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action_type: "STATUS_CHANGED",
        old_value: { status: oldItem.status },
        new_value: { status },
        item_id: itemId,
        user_id: session.user.id,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Failed to update item status:", error);
    return NextResponse.json(
      { error: "Failed to update item status" },
      { status: 500 }
    );
  }
}
