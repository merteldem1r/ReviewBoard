import { message } from "antd";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  console.log("Cron for the items triggered");
  return NextResponse.json({ message: "Test Items crone" }, { status: 201 });
};
