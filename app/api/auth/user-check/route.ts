import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    console.log("⏳ Checking authentication...");
    const { userId } = await auth();

    if (!userId) {
      console.error("❌ No userId found from Clerk.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`🔍 Checking if user exists in Supabase: ${userId}`);
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
      console.log(`✅ User already exists: ${existingUser.email}`);
      return NextResponse.json({ message: "User already exists" });
    }

    console.log(`🆕 Creating new user in Supabase: ${userId}`);

    const clerkResponse = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!clerkResponse.ok) {
      console.error("❌ Failed to fetch user from Clerk:", clerkResponse.statusText);
      return NextResponse.json({ error: "Clerk API error" }, { status: 500 });
    }

    const clerkUser = await clerkResponse.json();
    console.log("✅ Clerk user fetched:", clerkUser);

    // Force insert user in Supabase
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: clerkUser.email_addresses[0]?.email_address || "unknown",
        role: "user",
      },
    });

    console.log(`✅ New user created in Supabase: ${newUser.email}`);
    return NextResponse.json({ message: "User created successfully" });

  } catch (error) {
    console.error("❌ Error checking user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}