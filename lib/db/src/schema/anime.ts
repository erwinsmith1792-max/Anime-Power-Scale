import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const animeTable = pgTable("anime", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  genre: text("genre").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  characterCount: integer("character_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnimeSchema = createInsertSchema(animeTable).omit({ id: true, createdAt: true });
export type InsertAnime = z.infer<typeof insertAnimeSchema>;
export type Anime = typeof animeTable.$inferSelect;
