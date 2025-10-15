import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { bets, betOptions, betParticipations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const betId = parseInt(id);
    if (!betId || isNaN(betId)) {
      return NextResponse.json({ error: "Invalid bet ID" }, { status: 400 });
    }

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: number;
      email: string;
      role: string;
    };

    // Check if user is admin
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { userId, newOptionId } = await request.json();

    if (!userId || !newOptionId) {
      return NextResponse.json(
        { error: "User ID and new option ID are required" },
        { status: 400 }
      );
    }

    // Check if bet exists and is not resolved
    const [bet] = await db
      .select()
      .from(bets)
      .where(eq(bets.id, betId))
      .limit(1);

    if (!bet) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 });
    }

    if (bet.status === "resolved") {
      return NextResponse.json(
        { error: "Cannot change options for resolved bets" },
        { status: 400 }
      );
    }

    // Check if new option exists for this bet
    const [selectedOption] = await db
      .select()
      .from(betOptions)
      .where(and(eq(betOptions.id, newOptionId), eq(betOptions.betId, betId)))
      .limit(1);

    if (!selectedOption) {
      return NextResponse.json(
        { error: "Selected option does not exist for this bet" },
        { status: 400 }
      );
    }

    // Check if user is participating in this bet
    const [existingParticipation] = await db
      .select()
      .from(betParticipations)
      .where(
        and(
          eq(betParticipations.betId, betId),
          eq(betParticipations.userId, userId)
        )
      )
      .limit(1);

    if (!existingParticipation) {
      return NextResponse.json(
        { error: "User is not participating in this bet" },
        { status: 400 }
      );
    }

    // Update the participation with new option
    await db
      .update(betParticipations)
      .set({ selectedOptionId: newOptionId })
      .where(
        and(
          eq(betParticipations.betId, betId),
          eq(betParticipations.userId, userId)
        )
      );

    // Get updated participation
    const [updatedParticipation] = await db
      .select()
      .from(betParticipations)
      .where(
        and(
          eq(betParticipations.betId, betId),
          eq(betParticipations.userId, userId)
        )
      )
      .limit(1);

    return NextResponse.json({
      message: "Successfully updated user's bet option",
      participation: updatedParticipation,
    });
  } catch (error) {
    console.error("Change option error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
