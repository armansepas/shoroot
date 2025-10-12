import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bets, betOptions, betParticipations } from "@/lib/db/schema";
import { eq, count, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Get total count of active bets
    const totalResult = await db
      .select({ count: count() })
      .from(bets)
      .where(eq(bets.status, "active"));

    const total = totalResult[0].count;
    const totalPages = Math.ceil(total / limit);

    // Get active bets with pagination
    const activeBets = await db
      .select({
        id: bets.id,
        title: bets.title,
        description: bets.description,
        amount: bets.amount,
        status: bets.status,
        createdAt: bets.createdAt,
      })
      .from(bets)
      .where(eq(bets.status, "active"))
      .orderBy(desc(bets.createdAt))
      .limit(limit)
      .offset(offset);

    // Get first 2 options for each bet
    const optionsPromises = activeBets.map(async (bet) => {
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
    const participationPromises = activeBets.map(async (bet) => {
      const [result] = await db
        .select({ count: count() })
        .from(betParticipations)
        .where(eq(betParticipations.betId, bet.id));

      return result.count;
    });

    const participationCounts = await Promise.all(participationPromises);

    // Combine data
    const formattedBets = activeBets.map((bet, index) => ({
      id: bet.id,
      title: bet.title,
      description: bet.description,
      amount: bet.amount,
      status: bet.status,
      options: optionsLists[index],
      participationCount: participationCounts[index],
      createdAt: bet.createdAt,
    }));

    return NextResponse.json({
      bets: formattedBets,
      total_pages: totalPages,
    });
  } catch (error) {
    console.error("Get active bets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
