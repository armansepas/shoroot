import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { termsAndConditions } from "@/lib/db/schema";

export async function GET() {
  try {
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