import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Aggregate users by date
    const userGrowth: Record<string, number> = {};

    users.forEach((user) => {
      const date = user.createdAt.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      userGrowth[date] = (userGrowth[date] || 0) + 1;
    });

    // Convert to cumulative data
    let cumulativeTotal = 0;
    const growthData = Object.entries(userGrowth).map(([date, count]) => {
      cumulativeTotal += count;
      return { date, totalUsers: cumulativeTotal };
    });

    return NextResponse.json(growthData);
  } catch (error) {
    console.error("❌ Error fetching user growth:", error);
    return NextResponse.json({ error: "Failed to fetch user growth" }, { status: 500 });
  }
}