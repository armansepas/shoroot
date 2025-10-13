import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { bets, betOptions, betParticipations, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notifyBetParticipants } from "@/lib/notifications";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const betId = parseInt(params.id);
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

    const { selectedOptionId } = await request.json();

    if (!selectedOptionId) {
      return NextResponse.json(
        { error: "Selected option ID is required" },
        { status: 400 }
      );
    }

    // Check if bet exists and is active
    const [bet] = await db
      .select()
      .from(bets)
      .where(eq(bets.id, betId))
      .limit(1);

    if (!bet) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 });
    }

    if (bet.status !== "active") {
      return NextResponse.json(
        { error: "Bet is not available for participation" },
        { status: 400 }
      );
    }

    // Check if selected option exists for this bet
    const [selectedOption] = await db
      .select()
      .from(betOptions)
      .where(
        and(eq(betOptions.id, selectedOptionId), eq(betOptions.betId, betId))
      )
      .limit(1);

    if (!selectedOption) {
      return NextResponse.json(
        { error: "Selected option does not exist for this bet" },
        { status: 400 }
      );
    }

    // Check if user has already participated
    const [existingParticipation] = await db
      .select()
      .from(betParticipations)
      .where(
        and(
          eq(betParticipations.betId, betId),
          eq(betParticipations.userId, decoded.userId)
        )
      )
      .limit(1);

    if (existingParticipation) {
      return NextResponse.json(
        { error: "You have already participated in this bet" },
        { status: 400 }
      );
    }

    // Get user details for notification
    const [user] = await db
      .select({ fullName: users.fullName })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    // Create participation record
    await db.insert(betParticipations).values({
      userId: decoded.userId,
      betId: betId,
      selectedOptionId: selectedOptionId,
    });

    // Notify other participants about the new participant
    notifyBetParticipants(
      betId,
      "new_participant",
      `New participant in: ${bet.title}`,
      `${user?.fullName || "A user"} joined the bet and chose "${
        selectedOption.optionText
      }".`,
      {
        betId,
        betTitle: bet.title,
        userFullName: user?.fullName || "Unknown User",
        selectedOption: selectedOption.optionText,
      },
      decoded.userId // exclude the new participant from notification
    );

    return NextResponse.json({
      message: "Successfully participated in bet",
    });
  } catch (error) {
    console.error("Participation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
