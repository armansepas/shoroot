import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { betParticipations, bets } from "@/lib/db/schema";
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

    const { participationId } = await request.json();

    if (!participationId) {
      return NextResponse.json(
        { error: "Participation ID is required" },
        { status: 400 }
      );
    }

    // Check if participation exists and belongs to this bet
    const [participation] = await db
      .select()
      .from(betParticipations)
      .where(eq(betParticipations.id, participationId))
      .limit(1);

    if (!participation || participation.betId !== betId) {
      return NextResponse.json(
        { error: "Participation not found" },
        { status: 404 }
      );
    }

    // Check if bet is resolved (don't allow removing from resolved bets)
    const [bet] = await db
      .select({ status: bets.status })
      .from(bets)
      .where(eq(bets.id, betId))
      .limit(1);

    if (bet && bet.status === "resolved") {
      return NextResponse.json(
        { error: "Cannot remove participation from resolved bets" },
        { status: 400 }
      );
    }

    // Delete the participation
    await db
      .delete(betParticipations)
      .where(eq(betParticipations.id, participationId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove participation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
