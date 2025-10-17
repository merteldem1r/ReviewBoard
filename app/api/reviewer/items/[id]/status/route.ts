import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

    if (session.user.role !== "REVIEWER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    const { id: itemId } = await params;

    const validStatuses = ["NEW", "IN_REVIEW", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get current item data for audit log
    const currentItem = await prisma.item.findUnique({
      where: { id: itemId },
      select: {
        status: true,
        title: true,
      },
    });

    if (!currentItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Update item status
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { status },
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
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action_type: "STATUS_CHANGED",
        item_id: itemId,
        user_id: session.user.id,
        old_value: JSON.stringify({
          status: currentItem.status,
        }),
        new_value: JSON.stringify({
          status,
          changed_by: session.user.username,
        }),
      },
    });

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
