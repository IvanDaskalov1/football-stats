import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server"; // ✅ Correct import

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const { userId } = getAuth(req); // ✅ Correct method for authentication

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the user from Prisma to check their role
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
};