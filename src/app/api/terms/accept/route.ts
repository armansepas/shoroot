import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "@/lib/auth/middleware";

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await authMiddleware(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update user to mark terms as accepted
    await db
      .update(users)
      .set({
        hasAcceptedTerms: true,
        acceptedTermsAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to accept terms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}