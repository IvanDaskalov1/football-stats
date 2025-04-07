import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: any) {
  const userId = params.id

  try {
    const existingEntries = await prisma.prediction.findMany({
      where: { userId },
    })

    if (existingEntries.length === 0) {
      return NextResponse.json({ error: "User not found in leaderboard" }, { status: 404 })
    }

    await prisma.prediction.deleteMany({ where: { userId } })

    return NextResponse.json({ message: "User removed from leaderboard" })
  } catch (error) {
    console.error("❌ Error deleting leaderboard entry:", error)
    return NextResponse.json({ error: "Failed to remove user from leaderboard" }, { status: 500 })
  }
}