import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bets, betOptions, betParticipations } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Get all bets (active, in-progress, resolved) without auth for public dashboard
    const betsData = await db
      .select({
        id: bets.id,
        title: bets.title,
        description: bets.description,
        amount: bets.amount,
        status: bets.status,
        winningOption: bets.winningOption,
        createdAt: bets.createdAt,
      })
      .from(bets)
      .orderBy(desc(bets.createdAt));

    // Get first 2 options for each bet
    const optionsPromises = betsData.map(async (bet) => {
      const betOptionsData = await db
        .select({
          id: betOptions.id,
          optionText: betOptions.optionText,
        })
        .from(betOptions)
        .where(eq(betOptions.betId, bet.id))
        .orderBy(betOptions.id)
        .limit(2);

      return betOptionsData;
    });

    const optionsLists = await Promise.all(optionsPromises);

    // Get participation counts for each bet
    const participationPromises = betsData.map(async (bet) => {
      const [result] = await db
        .select({ count: count() })
        .from(betParticipations)
        .where(eq(betParticipations.betId, bet.id));

      return result.count;
    });

    const participationCounts = await Promise.all(participationPromises);

    // Get winning option text for resolved bets
    const winningOptionPromises = betsData.map(async (bet) => {
      if (bet.status === "resolved" && bet.winningOption) {
        const winningOptionId = parseInt(bet.winningOption);
        const [winningOption] = await db
          .select({
            optionText: betOptions.optionText,
          })
          .from(betOptions)
          .where(eq(betOptions.id, winningOptionId));

        return winningOption?.optionText || null;
      }
      return null;
    });

    const winningOptions = await Promise.all(winningOptionPromises);

    // Combine data
    const formattedBets = betsData.map((bet, index) => ({
      id: bet.id,
      title: bet.title,
      description: bet.description,
      amount: bet.amount,
      status: bet.status,
      winningOption: bet.winningOption,
      winningOptionText: winningOptions[index],
      options: optionsLists[index],
      participationCount: participationCounts[index],
      createdAt: bet.createdAt,
    }));

    return NextResponse.json({ bets: formattedBets });
  } catch (error) {
    console.error("Get public bets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
