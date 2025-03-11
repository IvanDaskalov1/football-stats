import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if any leaderboard entry exists for the user
    const existingEntries = await prisma.prediction.findMany({
      where: { userId: params.id },
    });

    if (!existingEntries || existingEntries.length === 0) {
      return NextResponse.json({ error: "User not found in leaderboard" }, { status: 404 });
    }

    // Delete all leaderboard entries for the user
    await prisma.prediction.deleteMany({
      where: { userId: params.id },
    });

    return NextResponse.json({ message: "User removed from leaderboard" });
  } catch (error) {
    console.error("Error deleting leaderboard entry:", error);
    return NextResponse.json({ error: "Failed to remove user from leaderboard" }, { status: 500 });
  }
}