import { NextRequest, NextResponse } from "next/server";
import { eq, count, sum, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, bets, betParticipations } from "@/lib/db/schema";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    let decoded: { id: number; role: string; email: string } | null = null;

    // Try to decode token if provided, but don't require it for public stats
    if (token) {
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: number;
          role: string;
          email: string;
        };
      } catch (tokenError) {
        // Token is invalid, continue without authentication
        decoded = null;
      }
    }

    // Base stats for all authenticated users
    const [
      totalUsers,
      totalBets,
      activeBetsCount,
      inProgressBetsCount,
      resolvedBetsCount,
      totalMoneyRaised,
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(bets),
      db.select({ count: count() }).from(bets).where(eq(bets.status, "active")),
      db
        .select({ count: count() })
        .from(bets)
        .where(eq(bets.status, "in-progress")),
      db
        .select({ count: count() })
        .from(bets)
        .where(eq(bets.status, "resolved")),
      db.select({ total: sum(bets.amount) }).from(bets),
    ]);

    // Calculate total money raised (sum of all bet amounts multiplied by participants)
    const moneyRaisedResult = await db
      .select({
        total: sql<number>`SUM(${bets.amount} * (
          SELECT COUNT(*) FROM ${betParticipations} WHERE ${betParticipations.betId} = ${bets.id}
        ))`,
      })
      .from(bets);

    const totalMoneyRaisedValue = moneyRaisedResult[0]?.total || 0;

    // Get top winner by win count
    const topWinnerByCount = await db
      .select({
        userId: users.id,
        email: users.email,
        fullName: users.fullName,
        winCount: sql<number>`COUNT(*)`,
      })
      .from(betParticipations)
      .innerJoin(users, eq(betParticipations.userId, users.id))
      .where(eq(betParticipations.isWinner, true))
      .groupBy(users.id, users.email, users.fullName)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(1);

    // Get top winner by total amount won
    const topWinnerByAmount = await db
      .select({
        userId: users.id,
        email: users.email,
        fullName: users.fullName,
        totalWon: sql<number>`SUM(${bets.amount})`,
      })
      .from(betParticipations)
      .innerJoin(users, eq(betParticipations.userId, users.id))
      .innerJoin(bets, eq(betParticipations.betId, bets.id))
      .where(eq(betParticipations.isWinner, true))
      .groupBy(users.id, users.email, users.fullName)
      .orderBy(sql`SUM(${bets.amount}) DESC`)
      .limit(1);

    // Get leaderboard (all users with participations, sorted by win count)
    const leaderboard = await db
      .select({
        userId: users.id,
        email: users.email,
        fullName: users.fullName,
        totalWon: sql<number>`COALESCE(SUM(CASE WHEN ${betParticipations.isWinner} = true THEN ${bets.amount} ELSE 0 END), 0)`,
        totalLost: sql<number>`COALESCE(SUM(CASE WHEN ${betParticipations.isWinner} = false THEN ${bets.amount} ELSE 0 END), 0)`,
        winCount: sql<number>`COALESCE(SUM(CASE WHEN ${betParticipations.isWinner} = true THEN 1 ELSE 0 END), 0)`,
        lostCount: sql<number>`COALESCE(SUM(CASE WHEN ${betParticipations.isWinner} = false THEN 1 ELSE 0 END), 0)`,
        totalParticipation: sql<number>`COUNT(*)`,
      })
      .from(betParticipations)
      .innerJoin(users, eq(betParticipations.userId, users.id))
      .innerJoin(bets, eq(betParticipations.betId, bets.id))
      .groupBy(users.id, users.email, users.fullName)
      .orderBy(
        sql`COALESCE(SUM(CASE WHEN ${betParticipations.isWinner} = true THEN 1 ELSE 0 END), 0) DESC`
      )
      .limit(50); // Show more users since we're showing all with participations

    // Ensure we return an array even if empty
    const leaderboardData = Array.isArray(leaderboard) ? leaderboard : [];

    // User-specific stats (only if authenticated)
    const userStats = decoded
      ? await Promise.all([
          db
            .select({ count: count() })
            .from(betParticipations)
            .where(eq(betParticipations.userId, decoded.id)),
          db
            .select({ count: count() })
            .from(betParticipations)
            .where(
              sql`${betParticipations.userId} = ${decoded.id} AND ${betParticipations.isWinner} = true`
            ),
          db
            .select({ count: count() })
            .from(betParticipations)
            .where(
              sql`${betParticipations.userId} = ${decoded.id} AND ${betParticipations.isWinner} = false`
            ),
          db
            .select({ total: sql<number>`SUM(${bets.amount})` })
            .from(betParticipations)
            .innerJoin(bets, eq(betParticipations.betId, bets.id))
            .where(
              sql`${betParticipations.userId} = ${decoded.id} AND ${betParticipations.isWinner} = true`
            ),
          db
            .select({ total: sql<number>`SUM(${bets.amount})` })
            .from(betParticipations)
            .innerJoin(bets, eq(betParticipations.betId, bets.id))
            .where(
              sql`${betParticipations.userId} = ${decoded.id} AND ${betParticipations.isWinner} = false`
            ),
        ])
      : null;

    const response = {
      // Public stats
      totalBets: totalBets[0].count,
      activeBets: activeBetsCount[0].count,
      inProgressBets: inProgressBetsCount[0].count,
      closedBets: resolvedBetsCount[0].count,
      totalMoneyRaised: totalMoneyRaisedValue,
      totalUsers: totalUsers[0].count,
      topWinnerByCount: topWinnerByCount[0] || null,
      topWinnerByAmount: topWinnerByAmount[0] || null,
      leaderboard: leaderboardData,

      // User-specific stats (only include if authenticated)
      ...(userStats && decoded
        ? {
            userStats: {
              participated: userStats[0][0].count,
              won: userStats[1][0].count,
              lost: userStats[2][0].count,
              totalMoneyWon: userStats[3][0]?.total || 0,
              totalMoneyLost: userStats[4][0]?.total || 0,
            },
          }
        : {}),

      // Admin-specific stats (only include if admin)
      ...(decoded &&
        decoded.role === "admin" && {
          adminStats: {
            totalUsers: totalUsers[0].count,
            activeBets: activeBetsCount[0].count,
            resolvedBets: resolvedBetsCount[0].count,
            closedBets: resolvedBetsCount[0].count, // Assuming closed = resolved
            totalMoneyRaised: totalMoneyRaisedValue,
          },
        }),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
