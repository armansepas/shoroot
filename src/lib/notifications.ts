import { db } from "@/lib/db";
import { notifications, users, betParticipations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface NotificationData {
  betId?: number;
  betTitle?: string;
  userFullName?: string;
  selectedOption?: string;
  registrationDate?: string;
}

export async function createNotification(
  userId: number,
  type:
    | "new_bet"
    | "bet_resolved"
    | "bet_in_progress"
    | "bet_deleted"
    | "new_participant"
    | "new_user",
  title: string,
  description: string,
  data?: NotificationData
) {
  try {
    console.log(
      "Creating notification for user",
      userId,
      "type:",
      type,
      "title:",
      title
    );
    await db.insert(notifications).values({
      userId,
      type,
      title,
      description,
      data: data ? JSON.stringify(data) : null,
    });
    console.log("Notification created successfully");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

export async function notifyAllUsers(
  type:
    | "new_bet"
    | "bet_resolved"
    | "bet_in_progress"
    | "bet_deleted"
    | "new_participant"
    | "new_user",
  title: string,
  description: string,
  data?: NotificationData,
  excludeUserId?: number
) {
  try {
    const allUsers = await db.select({ id: users.id }).from(users);

    const promises = allUsers
      .filter((user) => !excludeUserId || user.id !== excludeUserId)
      .map((user) =>
        createNotification(user.id, type, title, description, data)
      );

    await Promise.all(promises);
  } catch (error) {
    console.error("Error notifying all users:", error);
  }
}

export async function notifyAdmins(
  type: "new_user",
  title: string,
  description: string,
  data?: NotificationData
) {
  try {
    const adminUsers = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "admin"));

    const promises = adminUsers.map((user) =>
      createNotification(user.id, type, title, description, data)
    );

    await Promise.all(promises);
  } catch (error) {
    console.error("Error notifying admins:", error);
  }
}

export async function notifyBetParticipants(
  betId: number,
  type: "bet_resolved" | "bet_in_progress" | "bet_deleted" | "new_participant",
  title: string,
  description: string,
  data?: NotificationData,
  excludeUserId?: number
) {
  try {
    const participantUserIds = await db
      .select({ userId: betParticipations.userId })
      .from(betParticipations)
      .where(eq(betParticipations.betId, betId));

    const promises = participantUserIds
      .filter(
        (participant) => !excludeUserId || participant.userId !== excludeUserId
      )
      .map((participant) =>
        createNotification(participant.userId, type, title, description, data)
      );

    await Promise.all(promises);
  } catch (error) {
    console.error("Error notifying bet participants:", error);
  }
}
