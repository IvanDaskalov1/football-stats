import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node"; // ✅ Correct Clerk import
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = await context.params; // ✅ Correctly extract `id`
    const { role } = await req.json();

    // Validate role
    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update role in Prisma (Supabase)
    await prisma.user.update({
      where: { id },
      data: { role },
    });

    // Update role in Clerk
    await clerkClient.users.updateUser(id, {
      publicMetadata: { role },
    });

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: params.id } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete from Clerk
    await clerkClient.users.deleteUser(params.id);

    // Delete user from Prisma (Supabase)
    await prisma.user.delete({
      where: { id: params.id },
    });

    // Delete user from Prisma-based leaderboard table
    await prisma.prediction.deleteMany({
      where: { userId: params.id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}