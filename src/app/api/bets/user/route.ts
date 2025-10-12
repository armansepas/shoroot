import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { bets, betOptions, betParticipations } from "@/lib/db/schema";
import { eq, count, desc, or, and } from "drizzle-orm";

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const tab = searchParams.get("tab") || "all"; // all, active, in-progress, resolved

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const offset = (page - 1) * limit;

    // Build where condition based on tab
    let statusCondition;
    if (tab === "active") {
      statusCondition = eq(bets.status, "active");
    } else if (tab === "in-progress") {
      statusCondition = eq(bets.status, "in-progress");
    } else if (tab === "resolved") {
      statusCondition = eq(bets.status, "resolved");
    } else {
      // all tab - no status filter
      statusCondition = undefined;
    }

    // Get total count of bets for the user based on tab
    const totalQuery = statusCondition
      ? await db.select({ count: count() }).from(bets).where(statusCondition)
      : await db.select({ count: count() }).from(bets);

    const total = totalQuery[0].count;
    const totalPages = Math.ceil(total / limit);

    // Get bets with pagination
    const betsQuery = statusCondition
      ? await db
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
          .where(statusCondition)
          .orderBy(desc(bets.createdAt))
          .limit(limit)
          .offset(offset)
      : await db
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
          .orderBy(desc(bets.createdAt))
          .limit(limit)
          .offset(offset);

    const betsData = betsQuery;

    // Get all options for each bet (not limited to 2)
    const optionsPromises = betsData.map(async (bet) => {
      const betOptionsData = await db
        .select({
          id: betOptions.id,
          optionText: betOptions.optionText,
        })
        .from(betOptions)
        .where(eq(betOptions.betId, bet.id))
        .orderBy(betOptions.id);

      return betOptionsData;
    });

    const optionsLists = await Promise.all(optionsPromises);

    // Get participation counts for each bet
    const participationPromises = betsData.map(async (bet) => {
      const result = await db
        .select({ count: count() })
        .from(betParticipations)
        .where(eq(betParticipations.betId, bet.id));

      return result[0].count;
    });

    const participationCounts = await Promise.all(participationPromises);

    // Check if user has already participated in each bet
    const userParticipationPromises = betsData.map(async (bet) => {
      const result = await db
        .select({ count: count() })
        .from(betParticipations)
        .where(
          and(
            eq(betParticipations.betId, bet.id),
            eq(betParticipations.userId, decoded.id)
          )
        );
      return result.length > 0 && result[0].count > 0;
    });

    const userParticipations = await Promise.all(userParticipationPromises);

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
      hasUserParticipated: userParticipations[index],
      createdAt: bet.createdAt,
    }));

    return NextResponse.json({
      bets: formattedBets,
      total_pages: totalPages,
    });
  } catch (error) {
    console.error("Get user bets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
