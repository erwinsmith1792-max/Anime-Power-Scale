import { pgTable, serial, text, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { charactersTable } from "./characters";

export const battlesTable = pgTable("battles", {
  id: serial("id").primaryKey(),
  character1Id: integer("character1_id").notNull().references(() => charactersTable.id),
  character2Id: integer("character2_id").notNull().references(() => charactersTable.id),
  character1Form: text("character1_form"),
  character2Form: text("character2_form"),
  winnerId: integer("winner_id"),
  winnerName: text("winner_name"),
  confidenceScore: real("confidence_score").notNull().default(0),
  confidenceLabel: text("confidence_label").notNull().default("Medium"),
  reasoning: text("reasoning").notNull().default(""),
  reasoningSteps: jsonb("reasoning_steps").notNull().default([]),
  metricComparisons: jsonb("metric_comparisons").notNull().default([]),
  evidenceUsedIds: jsonb("evidence_used_ids").notNull().default([]),
  contradictions: jsonb("contradictions").notNull().default([]),
  limitations: jsonb("limitations").notNull().default([]),
  verdict: text("verdict").notNull().default(""),
  context: text("context"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBattleSchema = createInsertSchema(battlesTable).omit({ id: true, createdAt: true });
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Battle = typeof battlesTable.$inferSelect;
