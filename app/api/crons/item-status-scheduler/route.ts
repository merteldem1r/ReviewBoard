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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Cron job started: Auto-updating item statuses");

    // for 1 hour ago
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const updateResult = await prisma.item.updateMany({
      where: {
        status: "NEW",
        is_active: true,
        created_at: {
          lt: oneHourAgo,
        },
      },
      data: {
        status: "IN_REVIEW",
        updated_at: new Date(),
      },
    });

    console.log(`Successfully updated ${updateResult.count} items to IN_REVIEW`);

    return NextResponse.json(
      {
        message: updateResult.count > 0 
          ? "Item statuses updated successfully" 
          : "No items to update",
        updated: updateResult.count,
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

