import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error("CRON_SECRET not configured");
      return NextResponse.json(
        { error: "Cron configuration error" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error("Unauthorized cron attempt");
      console.log(authHeader, cronSecret);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Cron job started: Auto-updating item statuses");

    // items that created less
    const minutesAgo30 = new Date();
    minutesAgo30.setMinutes(minutesAgo30.getMinutes() - 30);

    // Find items to update
    const itemsToUpdate = await prisma.item.findMany({
      where: {
        status: "NEW",
        is_active: true,
        created_at: {
          lt: minutesAgo30,
        },
      },
      select: {
        id: true,
        user_id: true,
        status: true,
      },
    });

    if (itemsToUpdate.length === 0) {
      console.log("No items to update");
      return NextResponse.json(
        {
          message: "No items to update",
          updated: 0,
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    const updateCount = await prisma.$transaction(async (tx) => {
      let count = 0;

      for (const item of itemsToUpdate) {
        await tx.item.update({
          where: { id: item.id },
          data: {
            status: "IN_REVIEW",
            updated_at: new Date(),
          },
        });

        await tx.auditLog.create({
          data: {
            item_id: item.id,
            user_id: item.user_id,
            action_type: "STATUS_CHANGED_BY_SYSTEM",
            old_value: { status: item.status },
            new_value: { status: "IN_REVIEW" },
          },
        });

        count++;
      }

      return count;
    });

    console.log(
      `Successfully updated ${updateCount} items to IN_REVIEW with audit logs`
    );

    return NextResponse.json(
      {
        message: "Item statuses updated successfully",
        updated: updateCount,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        error: "Failed to update item statuses",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
};
