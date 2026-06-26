import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { animeTable } from "./anime";

export const charactersTable = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull().default(""),
  animeId: integer("anime_id").notNull().references(() => animeTable.id),
  tier: text("tier").notNull().default("S"),
  imageUrl: text("image_url"),
  powerLevel: integer("power_level"),
  description: text("description"),
  forms: jsonb("forms").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCharacterSchema = createInsertSchema(charactersTable).omit({ id: true, createdAt: true });
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Character = typeof charactersTable.$inferSelect;
