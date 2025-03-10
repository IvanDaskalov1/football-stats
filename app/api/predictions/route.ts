import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const predictions = await prisma.prediction.findMany()
    return NextResponse.json({ predictions })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch predictions" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId, userName, matchId, prediction } = await req.json()

    if (!userId || !matchId || !prediction || !userName) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    const newPrediction = await prisma.prediction.create({
      data: { userId, userName, matchId, prediction },
    })

    return NextResponse.json({ message: "Prediction saved!", prediction: newPrediction })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save prediction" }, { status: 500 })
  }
}