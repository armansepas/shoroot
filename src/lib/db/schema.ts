import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "user"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bets = pgTable("bets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  status: text("status", {
    enum: ["active", "in-progress", "resolved"],
  }).notNull(),
  winningOption: text("winning_option"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const betOptions = pgTable("bet_options", {
  id: serial("id").primaryKey(),
  betId: integer("bet_id")
    .notNull()
    .references(() => bets.id),
  optionText: text("option_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const betParticipations = pgTable(
  "bet_participations",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    betId: integer("bet_id")
      .notNull()
      .references(() => bets.id),
    selectedOptionId: integer("selected_option_id").references(
      () => betOptions.id
    ),
    isWinner: boolean("is_winner"),
    participatedAt: timestamp("participated_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueUserBet: uniqueIndex("unique_user_bet").on(table.userId, table.betId),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  participations: many(betParticipations),
}));

export const betsRelations = relations(bets, ({ many }) => ({
  options: many(betOptions),
  participations: many(betParticipations),
}));

export const betOptionsRelations = relations(betOptions, ({ one, many }) => ({
  bet: one(bets, {
    fields: [betOptions.betId],
    references: [bets.id],
  }),
}));

export const betParticipationsRelations = relations(
  betParticipations,
  ({ one }) => ({
    user: one(users, {
      fields: [betParticipations.userId],
      references: [users.id],
    }),
    bet: one(bets, {
      fields: [betParticipations.betId],
      references: [bets.id],
    }),
    selectedOption: one(betOptions, {
      fields: [betParticipations.selectedOptionId],
      references: [betOptions.id],
    }),
  })
);
