import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bets } from "@/lib/db/schema";
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

    const { title, description, amount } = await request.json();

    if (!title || !description || !amount) {
      return NextResponse.json(
        { error: "Title, description, and amount are required" },
        { status: 400 }
      );
    }

    const numericAmount = parseInt(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
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

    // Don't allow editing resolved bets
    if (existingBet.status === "resolved") {
      return NextResponse.json(
        { error: "Cannot edit resolved bets" },
        { status: 400 }
      );
    }

    // Update the bet
    await db
      .update(bets)
      .set({
        title: title.trim(),
        description: description.trim(),
        amount: numericAmount,
        updatedAt: new Date(),
      })
      .where(eq(bets.id, betId));

    // Get updated bet data
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

    return NextResponse.json({ bet: updatedBet });
  } catch (error) {
    console.error("Edit bet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
