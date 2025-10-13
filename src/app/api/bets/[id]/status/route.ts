import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { bets, betParticipations, betOptions } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { notifyBetParticipants } from "@/lib/notifications";

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

    const { status, winningOption } = await request.json();

    if (!status || !["active", "in-progress", "resolved"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // If resolving, winning option is required
    if (status === "resolved" && !winningOption) {
      return NextResponse.json(
        { error: "Winning option required for resolved status" },
        { status: 400 }
      );
    }

    // Get the bet to verify it exists
    const [bet] = await db
      .select()
      .from(bets)
      .where(eq(bets.id, betId))
      .limit(1);

    if (!bet) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 });
    }

    // If resolving, find the winning option ID
    let winningOptionId = null;
    if (status === "resolved") {
      const [option] = await db
        .select({ id: betOptions.id })
        .from(betOptions)
        .where(
          and(
            eq(betOptions.betId, betId),
            eq(betOptions.optionText, winningOption)
          )
        )
        .limit(1);

      if (!option) {
        return NextResponse.json(
          { error: "Winning option not found" },
          { status: 400 }
        );
      }
      winningOptionId = option.id;

      // Update all participations to mark winners
      await db
        .update(betParticipations)
        .set({
          isWinner: eq(betParticipations.selectedOptionId, winningOptionId),
        })
        .where(eq(betParticipations.betId, betId));
    }

    // Update bet status
    await db
      .update(bets)
      .set({
        status: status,
        winningOption: winningOptionId?.toString() || null,
        updatedAt: new Date(),
      })
      .where(eq(bets.id, betId));

    // Create notifications based on status change
    if (status === "resolved") {
      notifyBetParticipants(
        betId,
        "bet_resolved",
        `Bet resolved: ${bet.title}`,
        `The bet "${bet.title}" has been resolved. Winners have been determined.`,
        {
          betId,
          betTitle: bet.title,
        }
      );
    } else if (status === "in-progress") {
      notifyBetParticipants(
        betId,
        "bet_in_progress",
        `Bet in progress: ${bet.title}`,
        `The bet "${bet.title}" is now in progress. No more participants can join.`,
        {
          betId,
          betTitle: bet.title,
        }
      );
    }

    // Fetch updated bet data
    const [updatedBet] = await db
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

    // Get options for the updated bet
    const options = await db
      .select({
        id: betOptions.id,
        optionText: betOptions.optionText,
      })
      .from(betOptions)
      .where(eq(betOptions.betId, betId))
      .orderBy(betOptions.id);

    // Get participation count
    const [participationResult] = await db
      .select({ count: count() })
      .from(betParticipations)
      .where(eq(betParticipations.betId, betId));

    const formattedBet = {
      id: updatedBet.id,
      title: updatedBet.title,
      description: updatedBet.description,
      amount: updatedBet.amount,
      status: updatedBet.status,
      winningOption: updatedBet.winningOption,
      options: options.map((opt) => ({
        id: opt.id,
        optionText: opt.optionText,
      })),
      participationCount: participationResult?.count || 0,
      createdAt: updatedBet.createdAt,
      updatedAt: updatedBet.updatedAt,
    };

    return NextResponse.json({
      message: "Bet status updated successfully",
      bet: formattedBet,
    });
  } catch (error) {
    console.error("Status change error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
