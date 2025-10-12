import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bets, betOptions, betParticipations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const betId = parseInt(id);

    if (isNaN(betId)) {
      return NextResponse.json({ error: "Invalid bet ID" }, { status: 400 });
    }

    // Get the bet
    const [bet] = await db
      .select({
        id: bets.id,
        title: bets.title,
        description: bets.description,
        amount: bets.amount,
        status: bets.status,
        winningOption: bets.winningOption,
        createdAt: bets.createdAt,
        updatedAt: bets.updatedAt,
      })
      .from(bets)
      .where(eq(bets.id, betId))
      .limit(1);

    if (!bet) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 });
    }

    // Get all options for this bet
    const options = await db
      .select({
        id: betOptions.id,
        optionText: betOptions.optionText,
      })
      .from(betOptions)
      .where(eq(betOptions.betId, betId))
      .orderBy(betOptions.id);

    // Get participants for this bet
    const participants = await db
      .select({
        id: betParticipations.id,
        userId: betParticipations.userId,
        selectedOptionId: betParticipations.selectedOptionId,
        isWinner: betParticipations.isWinner,
        participatedAt: betParticipations.participatedAt,
      })
      .from(betParticipations)
      .where(eq(betParticipations.betId, betId))
      .orderBy(betParticipations.participatedAt);

    // Format participants with option details
    const formattedParticipants = participants.map((participant) => ({
      id: participant.id,
      userId: participant.userId,
      selectedOptionText: participant.selectedOptionId
        ? options.find((opt) => opt.id === participant.selectedOptionId)
            ?.optionText
        : null,
      isWinner: participant.isWinner,
      participatedAt: participant.participatedAt,
    }));

    return NextResponse.json({
      bet: {
        id: bet.id,
        title: bet.title,
        description: bet.description,
        amount: bet.amount,
        status: bet.status,
        winningOption: bet.winningOption,
        options,
        participants: formattedParticipants,
        participationCount: participants.length,
        createdAt: bet.createdAt,
        updatedAt: bet.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get single bet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
