import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ Correct Clerk import
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, { params }: any) {
  try {
    const { id } = await params;
    const { role } = await req.json();

    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update in Supabase (via Prisma)
    await prisma.user.update({
      where: { id },
      data: { role },
    });

    // Update in Clerk
    await clerkClient.users.updateUser(id, {
      publicMetadata: { role },
    });

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: any) {
  try {
    // Check if user exists
    const { id } = await params;
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete from Clerk
    await clerkClient.users.deleteUser(id);

    // Delete user from Prisma (Supabase)
    await prisma.user.delete({
      where: { id },
    });

    // Delete user from Prisma-based leaderboard table
    await prisma.prediction.deleteMany({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}