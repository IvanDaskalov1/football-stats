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
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Check if prediction already exists for this user and match
    const existingPrediction = await prisma.prediction.findFirst({
      where: {
        userId,
        matchId,
      },
    })

    let result;
    
    if (existingPrediction) {
      // Update existing prediction
      result = await prisma.prediction.update({
        where: { id: existingPrediction.id },
        data: { prediction },
      })
    } else {
      // Create new prediction
      result = await prisma.prediction.create({
        data: { userId, userName, matchId, prediction },
      })
    }

    return NextResponse.json({ 
      message: existingPrediction ? "Prediction updated!" : "Prediction saved!", 
      prediction: result 
    })
  } catch (error) {
    console.error("Error saving prediction:", error)
    return NextResponse.json({ error: "Failed to save prediction" }, { status: 500 })
  }
}