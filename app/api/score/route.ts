import { NextResponse } from "next/server";
import { calculateRiskScore } from "@/lib/risk-calculator";

export async function POST(req: Request) {
  try {
    const { amount, tags } = await req.json();

    // Validate input
    if (!amount || !tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Amount and tags array are required" },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Calculate risk score
    const result = await calculateRiskScore({ amount, tags });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Risk calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate risk score" },
      { status: 500 }
    );
  }
}
