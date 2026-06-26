import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { charactersTable } from "./characters";

export const evidenceTable = pgTable("evidence", {
  id: serial("id").primaryKey(),
  characterId: integer("character_id").notNull().references(() => charactersTable.id),
  metric: text("metric").notNull(),
  content: text("content").notNull(),
  sourceType: text("source_type").notNull().default("manga"),
  seriesName: text("series_name"),
  chapterEpisode: text("chapter_episode"),
  pageScene: text("page_scene"),
  confidenceLevel: text("confidence_level").notNull().default("high"),
  isDirect: boolean("is_direct").notNull().default(true),
  embedding: text("embedding"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEvidenceSchema = createInsertSchema(evidenceTable).omit({ id: true, createdAt: true });
export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type Evidence = typeof evidenceTable.$inferSelect;
