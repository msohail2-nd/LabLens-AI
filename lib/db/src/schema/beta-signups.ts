import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const betaSignupsTable = pgTable(
  "beta_signups",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    researchField: text("research_field").notNull(),
    graduateProgram: text("graduate_program").notNull(),
    biggestChallenge: text("biggest_challenge").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("beta_signups_email_unique").on(table.email)],
);

export const insertBetaSignupSchema = createInsertSchema(
  betaSignupsTable,
).omit({
  id: true,
  createdAt: true,
});

export type InsertBetaSignup = z.infer<typeof insertBetaSignupSchema>;
export type BetaSignup = typeof betaSignupsTable.$inferSelect;