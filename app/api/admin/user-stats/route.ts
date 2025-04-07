import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count(); // ✅ Get total user count

    return NextResponse.json({ totalUsers: userCount });
  } catch (error) {
    console.error("❌ Error fetching user statistics:", error);
    return NextResponse.json({ error: "Failed to fetch user statistics" }, { status: 500 });
  }
}