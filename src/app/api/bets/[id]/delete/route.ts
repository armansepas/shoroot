import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bets, betOptions, betParticipations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const betId = parseInt(id);

    if (isNaN(betId)) {
      return NextResponse.json({ error: "Invalid bet ID" }, { status: 400 });
    }

    // Check if bet exists
    const [existingBet] = await db
      .select()
      .from(bets)
      .where(eq(bets.id, betId))
      .limit(1);

    if (!existingBet) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 });
    }

    // Don't allow deleting resolved bets
    if (existingBet.status === "resolved") {
      return NextResponse.json(
        { error: "Cannot delete resolved bets" },
        { status: 400 }
      );
    }

    // Delete in correct order: participations first, then options, then bet
    await db
      .delete(betParticipations)
      .where(eq(betParticipations.betId, betId));

    await db.delete(betOptions).where(eq(betOptions.betId, betId));

    await db.delete(bets).where(eq(bets.id, betId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete bet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
