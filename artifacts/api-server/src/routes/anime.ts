import { Router } from "express";
import { db } from "@workspace/db";
import { animeTable, charactersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/anime", async (req, res) => {
  try {
    const anime = await db.select({
      id: animeTable.id,
      name: animeTable.name,
      nameAr: animeTable.nameAr,
      genre: animeTable.genre,
      imageUrl: animeTable.imageUrl,
      description: animeTable.description,
      characterCount: sql<number>`(select count(*) from characters where anime_id = ${animeTable.id})::int`,
    }).from(animeTable).orderBy(animeTable.name);
    res.json(anime);
  } catch (err) {
    req.log.error({ err }, "Failed to list anime");
    res.status(500).json({ error: "Failed to list anime" });
  }
});

router.get("/anime/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const [anime] = await db.select({
      id: animeTable.id,
      name: animeTable.name,
      nameAr: animeTable.nameAr,
      genre: animeTable.genre,
      imageUrl: animeTable.imageUrl,
      description: animeTable.description,
      characterCount: sql<number>`(select count(*) from characters where anime_id = ${animeTable.id})::int`,
    }).from(animeTable).where(eq(animeTable.id, id));
    if (!anime) return res.status(404).json({ error: "Not found" });
    res.json(anime);
  } catch (err) {
    req.log.error({ err }, "Failed to get anime");
    res.status(500).json({ error: "Failed to get anime" });
  }
});

export default router;
