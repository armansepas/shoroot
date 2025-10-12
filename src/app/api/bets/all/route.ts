import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { bets, betOptions, betParticipations } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get all bets with their options and participation counts
    const betsData = await db
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
      .orderBy(bets.createdAt);

    // Get options for each bet
    const options = await db
      .select({
        id: betOptions.id,
        betId: betOptions.betId,
        optionText: betOptions.optionText,
      })
      .from(betOptions)
      .orderBy(betOptions.id);

    // Get participation counts for each bet
    const participationCounts = await db
      .select({
        betId: betParticipations.betId,
        count: count(),
      })
      .from(betParticipations)
      .groupBy(betParticipations.betId);

    // Combine data
    const formattedBets = betsData.map((bet) => {
      const betOptions = options.filter((opt) => opt.betId === bet.id);
      const participationCount =
        participationCounts.find((p) => p.betId === bet.id)?.count || 0;

      return {
        id: bet.id,
        title: bet.title,
        description: bet.description,
        amount: bet.amount,
        status: bet.status,
        winningOption: bet.winningOption,
        options: betOptions.map((opt) => ({
          id: opt.id,
          optionText: opt.optionText,
        })),
        participationCount,
        createdAt: bet.createdAt,
        updatedAt: bet.updatedAt,
      };
    });

    return NextResponse.json({ bets: formattedBets });
  } catch (error) {
    console.error("Get all bets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
