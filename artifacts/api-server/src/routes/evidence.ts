import { Router } from "express";
import { db } from "@workspace/db";
import { evidenceTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/evidence", async (req, res) => {
  try {
    const characterId = req.query.characterId ? parseInt(req.query.characterId as string) : undefined;
    const metric = req.query.metric as string | undefined;

    if (!characterId) return res.status(400).json({ error: "characterId is required" });

    const conditions = [eq(evidenceTable.characterId, characterId)];
    if (metric) conditions.push(eq(evidenceTable.metric, metric));

    const evidence = await db
      .select()
      .from(evidenceTable)
      .where(and(...conditions))
      .orderBy(evidenceTable.metric);

    res.json(evidence);
  } catch (err) {
    req.log.error({ err }, "Failed to list evidence");
    res.status(500).json({ error: "Failed to list evidence" });
  }
});

export default router;
