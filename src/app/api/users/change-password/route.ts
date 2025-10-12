import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { current_password, new_password, confirm_password } =
      await request.json();

    // Validate required fields
    if (!current_password || !new_password || !confirm_password) {
      return NextResponse.json(
        { error: "All password fields are required" },
        { status: 400 }
      );
    }

    // Validate password confirmation
    if (new_password !== confirm_password) {
      return NextResponse.json(
        { error: "New passwords don't match" },
        { status: 400 }
      );
    }

    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: number;
      email: string;
      role: string;
    };

    // Fetch user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = bcrypt.compareSync(
      current_password,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = bcrypt.hashSync(new_password, 12);

    // Update password
    await db
      .update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, decoded.userId));

    return NextResponse.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
