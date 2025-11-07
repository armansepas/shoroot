import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { termsAndConditions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { authMiddleware } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const user = await authMiddleware(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Get the latest terms (should only be one record)
    const terms = await db
      .select()
      .from(termsAndConditions)
      .limit(1)
      .orderBy(termsAndConditions.updatedAt);

    if (terms.length === 0) {
      return NextResponse.json({ error: "No terms found" }, { status: 404 });
    }

    return NextResponse.json(terms[0]);
  } catch (error) {
    console.error("Failed to fetch terms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const user = await authMiddleware(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Check if terms already exist
    const existingTerms = await db
      .select()
      .from(termsAndConditions)
      .limit(1);

    let result;
    if (existingTerms.length > 0) {
      // Update existing terms
      result = await db
        .update(termsAndConditions)
        .set({
          content: content.trim(),
          updatedAt: new Date(),
        })
        .where(eq(termsAndConditions.id, existingTerms[0].id))
        .returning();
    } else {
      // Create new terms
      result = await db
        .insert(termsAndConditions)
        .values({
          content: content.trim(),
        })
        .returning();
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to save terms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin access
    const user = await authMiddleware(request);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Get existing terms
    const existingTerms = await db
      .select()
      .from(termsAndConditions)
      .limit(1);

    if (existingTerms.length === 0) {
      return NextResponse.json({ error: "No terms found to update" }, { status: 404 });
    }

    // Update terms
    const result = await db
      .update(termsAndConditions)
      .set({
        content: content.trim(),
        updatedAt: new Date(),
      })
      .where(eq(termsAndConditions.id, existingTerms[0].id))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to update terms:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}