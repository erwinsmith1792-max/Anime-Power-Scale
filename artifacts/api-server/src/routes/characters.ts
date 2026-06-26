import { Router } from "express";
import { db } from "@workspace/db";
import { charactersTable, animeTable, evidenceTable } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";

const router = Router();

router.get("/characters", async (req, res) => {
  try {
    const animeId = req.query.animeId ? parseInt(req.query.animeId as string) : undefined;
    const search = req.query.search as string | undefined;

    const conditions = [];
    if (animeId) conditions.push(eq(charactersTable.animeId, animeId));
    if (search) conditions.push(ilike(charactersTable.name, `%${search}%`));

    const chars = await db
      .select({
        id: charactersTable.id,
        name: charactersTable.name,
        nameAr: charactersTable.nameAr,
        animeId: charactersTable.animeId,
        animeName: animeTable.name,
        animeNameAr: animeTable.nameAr,
        tier: charactersTable.tier,
        imageUrl: charactersTable.imageUrl,
        powerLevel: charactersTable.powerLevel,
        description: charactersTable.description,
        forms: charactersTable.forms,
        evidenceCount: sql<number>`(select count(*) from evidence where character_id = ${charactersTable.id})::int`,
      })
      .from(charactersTable)
      .leftJoin(animeTable, eq(charactersTable.animeId, animeTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(charactersTable.name);

    res.json(chars);
  } catch (err) {
    req.log.error({ err }, "Failed to list characters");
    res.status(500).json({ error: "Failed to list characters" });
  }
});

router.get("/characters/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [char] = await db
      .select({
        id: charactersTable.id,
        name: charactersTable.name,
        nameAr: charactersTable.nameAr,
        animeId: charactersTable.animeId,
        animeName: animeTable.name,
        animeNameAr: animeTable.nameAr,
        tier: charactersTable.tier,
        imageUrl: charactersTable.imageUrl,
        powerLevel: charactersTable.powerLevel,
        description: charactersTable.description,
        forms: charactersTable.forms,
        evidenceCount: sql<number>`(select count(*) from evidence where character_id = ${charactersTable.id})::int`,
      })
      .from(charactersTable)
      .leftJoin(animeTable, eq(charactersTable.animeId, animeTable.id))
      .where(eq(charactersTable.id, id));

    if (!char) return res.status(404).json({ error: "Character not found" });

    const evidence = await db.select().from(evidenceTable).where(eq(evidenceTable.characterId, id)).orderBy(evidenceTable.metric);

    res.json({ ...char, evidence, metrics: {} });
  } catch (err) {
    req.log.error({ err }, "Failed to get character");
    res.status(500).json({ error: "Failed to get character" });
  }
});

export default router;
