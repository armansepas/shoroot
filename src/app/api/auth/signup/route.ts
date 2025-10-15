import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notifyAdmins } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const { email, password, confirmPassword, fullName } = await request.json();

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    if (!normalizedEmail || !password || !confirmPassword || !fullName) {
      return NextResponse.json(
        {
          error:
            "Email, password, confirm password, and full name are required",
        },
        { status: 400 }
      );
    }

    if (fullName.trim().length < 3) {
      return NextResponse.json(
        { error: "Full name must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        fullName: fullName.trim(),
        password: hashedPassword,
        role: "user",
      })
      .returning();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "7d" }
    );

    // Notify admins about new user registration
    notifyAdmins(
      "new_user",
      `New user registered: ${newUser.fullName || "Unknown User"}`,
      `A new user has joined the platform.`,
      {
        userFullName: newUser.fullName || "Unknown User",
        registrationDate:
          newUser.createdAt?.toISOString().split("T")[0] ||
          new Date().toISOString().split("T")[0],
      }
    );

    // Return token and user data (excluding password)
    const { password: _, ...userData } = newUser;

    return NextResponse.json(
      {
        token,
        user: userData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
