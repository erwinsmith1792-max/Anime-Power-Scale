import { Router } from "express";
import { db } from "@workspace/db";
import { battlesTable, charactersTable, animeTable, evidenceTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function getCharacterWithEvidence(id: number) {
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
    })
    .from(charactersTable)
    .leftJoin(animeTable, eq(charactersTable.animeId, animeTable.id))
    .where(eq(charactersTable.id, id));

  if (!char) return null;

  const evidence = await db
    .select()
    .from(evidenceTable)
    .where(eq(evidenceTable.characterId, id))
    .orderBy(evidenceTable.metric);

  return { ...char, evidence, evidenceCount: evidence.length };
}

function buildAnalysisPrompt(char1: any, char2: any, form1: string, form2: string, context?: string) {
  const buildEvidenceText = (char: any) => {
    if (!char.evidence || char.evidence.length === 0) return "No recorded evidence yet.";
    return char.evidence.map((e: any) =>
      `[Metric: ${e.metric} | Source: ${e.sourceType} | Confidence: ${e.confidenceLevel} | Direct: ${e.isDirect ? "Yes" : "No"}]
Reference: ${e.seriesName || ""} ${e.chapterEpisode || ""} ${e.pageScene || ""}
Evidence: ${e.content}`
    ).join("\n\n");
  };

  return `You are an evidence-based analysis engine for comparing anime/manga characters. Your task is a rigorous academic-quality comparison.

## STRICT REASONING RULES:
1. Never conclude without direct evidence
2. Source priority: original manga > official databook > author statements > anime (if not contradicting manga) > secondary sources
3. When sources conflict: present both pieces of evidence and explain which is stronger and why
4. If insufficient evidence: state that explicitly rather than guessing
5. Always distinguish: direct facts / logical inferences / hypotheses
6. Build reasoning step-by-step, never jump to conclusions

## Character 1: ${char1.name} — Form: ${form1}
Series: ${char1.animeName}
Tier: ${char1.tier}
Description: ${char1.description || "N/A"}

### Evidence for ${char1.name} (${form1}):
${buildEvidenceText(char1)}

## Character 2: ${char2.name} — Form: ${form2}
Series: ${char2.animeName}
Tier: ${char2.tier}
Description: ${char2.description || "N/A"}

### Evidence for ${char2.name} (${form2}):
${buildEvidenceText(char2)}

${context ? `## Additional context from user:\n${context}` : ""}

## REQUIRED OUTPUT:
Respond ONLY with valid JSON (no markdown, no extra text):

{
  "winner": "winner's name or null if draw/inconclusive",
  "winnerKey": "character1 or character2 or null",
  "confidenceScore": <number 0-100>,
  "confidenceLabel": "High or Medium or Low",
  "verdict": "One-sentence final verdict",
  "reasoning": "Detailed academic analysis in English explaining methodology, evidence, and conclusion",
  "reasoningSteps": [
    { "step": 1, "description": "Step description", "evidenceIds": [], "conclusion": "Step conclusion" }
  ],
  "metricComparisons": [
    {
      "metric": "power",
      "metricAr": "القوة",
      "character1Score": <0-10>,
      "character2Score": <0-10>,
      "winner": "character1 or character2 or null",
      "reasoning": "Brief evidence-based explanation",
      "evidenceIds": []
    }
  ],
  "contradictions": ["contradiction 1 if any"],
  "limitations": ["analysis limitation 1"]
}

Metrics to evaluate (if evidence exists): power, attack_potency, speed, durability, battle_iq, hax, experience, stamina, range, regeneration

CRITICAL: Academic quality required. Every judgment must cite specific evidence.`;
}

router.post("/battles/analyze", async (req, res) => {
  try {
    const { character1Id, character2Id, character1Form, character2Form, context } = req.body;

    if (!character1Id || !character2Id) {
      return res.status(400).json({ error: "character1Id and character2Id are required" });
    }
    if (character1Id === character2Id) {
      return res.status(400).json({ error: "Cannot compare a character with itself" });
    }

    const [char1, char2] = await Promise.all([
      getCharacterWithEvidence(character1Id),
      getCharacterWithEvidence(character2Id),
    ]);

    if (!char1) return res.status(404).json({ error: `Character ${character1Id} not found` });
    if (!char2) return res.status(404).json({ error: `Character ${character2Id} not found` });

    const forms1 = (char1.forms as string[]) || [];
    const forms2 = (char2.forms as string[]) || [];
    const form1 = character1Form || (forms1.length > 0 ? forms1[0] : "Standard");
    const form2 = character2Form || (forms2.length > 0 ? forms2[0] : "Standard");

    const prompt = buildAnalysisPrompt(char1, char2, form1, form2, context);

    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";

    let analysis: any;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      analysis = {
        winner: null, winnerKey: null, confidenceScore: 50, confidenceLabel: "Medium",
        verdict: "Analysis could not be fully parsed",
        reasoning: rawText, reasoningSteps: [], metricComparisons: [], contradictions: [], limitations: [],
      };
    }

    const winnerId = analysis.winnerKey === "character1" ? character1Id
      : analysis.winnerKey === "character2" ? character2Id : null;

    const evidenceIds = [...char1.evidence.map((e: any) => e.id), ...char2.evidence.map((e: any) => e.id)];

    const [battle] = await db.insert(battlesTable).values({
      character1Id, character2Id,
      character1Form: form1, character2Form: form2,
      winnerId,
      winnerName: analysis.winner || null,
      confidenceScore: analysis.confidenceScore || 50,
      confidenceLabel: analysis.confidenceLabel || "Medium",
      reasoning: analysis.reasoning || "",
      reasoningSteps: analysis.reasoningSteps || [],
      metricComparisons: analysis.metricComparisons || [],
      evidenceUsedIds: evidenceIds,
      contradictions: analysis.contradictions || [],
      limitations: analysis.limitations || [],
      verdict: analysis.verdict || "",
      context: context || null,
    }).returning();

    const allEvidence = [...char1.evidence, ...char2.evidence];

    res.json({
      id: battle.id,
      character1: { ...char1, evidenceCount: char1.evidence.length },
      character2: { ...char2, evidenceCount: char2.evidence.length },
      character1Form: form1,
      character2Form: form2,
      winner: battle.winnerName,
      winnerId: battle.winnerId,
      confidenceScore: battle.confidenceScore,
      confidenceLabel: battle.confidenceLabel,
      reasoning: battle.reasoning,
      reasoningSteps: battle.reasoningSteps,
      metricComparisons: battle.metricComparisons,
      evidenceUsed: allEvidence,
      contradictions: battle.contradictions,
      limitations: battle.limitations,
      verdict: battle.verdict,
      createdAt: battle.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to analyze battle");
    res.status(500).json({ error: String(err) });
  }
});

router.get("/battles/history", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const battles = await db.select().from(battlesTable).orderBy(desc(battlesTable.createdAt)).limit(limit);

    const result = await Promise.all(battles.map(async (b) => {
      const [c1] = await db.select({ name: charactersTable.name, nameAr: charactersTable.nameAr })
        .from(charactersTable).where(eq(charactersTable.id, b.character1Id));
      const [c2] = await db.select({ name: charactersTable.name, nameAr: charactersTable.nameAr })
        .from(charactersTable).where(eq(charactersTable.id, b.character2Id));
      return {
        id: b.id,
        character1Name: c1?.name || "",
        character1NameAr: c1?.nameAr || "",
        character1Form: b.character1Form,
        character2Name: c2?.name || "",
        character2NameAr: c2?.nameAr || "",
        character2Form: b.character2Form,
        winner: b.winnerName,
        confidenceScore: b.confidenceScore,
        createdAt: b.createdAt.toISOString(),
      };
    }));

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list battles");
    res.status(500).json({ error: "Failed to list battles" });
  }
});

router.get("/battles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [battle] = await db.select().from(battlesTable).where(eq(battlesTable.id, id));
    if (!battle) return res.status(404).json({ error: "Battle not found" });

    const [char1, char2] = await Promise.all([
      getCharacterWithEvidence(battle.character1Id),
      getCharacterWithEvidence(battle.character2Id),
    ]);

    res.json({
      id: battle.id,
      character1: char1,
      character2: char2,
      character1Form: battle.character1Form,
      character2Form: battle.character2Form,
      winner: battle.winnerName,
      winnerId: battle.winnerId,
      confidenceScore: battle.confidenceScore,
      confidenceLabel: battle.confidenceLabel,
      reasoning: battle.reasoning,
      reasoningSteps: battle.reasoningSteps,
      metricComparisons: battle.metricComparisons,
      evidenceUsed: [...(char1?.evidence || []), ...(char2?.evidence || [])],
      contradictions: battle.contradictions,
      limitations: battle.limitations,
      verdict: battle.verdict,
      createdAt: battle.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get battle");
    res.status(500).json({ error: "Failed to get battle" });
  }
});

router.get("/stats/overview", async (req, res) => {
  try {
    const [[animeCount], [charCount], [battleCount], [evidenceCount]] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(animeTable),
      db.select({ count: sql<number>`count(*)::int` }).from(charactersTable),
      db.select({ count: sql<number>`count(*)::int` }).from(battlesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(evidenceTable),
    ]);

    const recentBattlesRaw = await db.select().from(battlesTable).orderBy(desc(battlesTable.createdAt)).limit(5);
    const recentBattles = await Promise.all(recentBattlesRaw.map(async (b) => {
      const [c1] = await db.select({ name: charactersTable.name, nameAr: charactersTable.nameAr }).from(charactersTable).where(eq(charactersTable.id, b.character1Id));
      const [c2] = await db.select({ name: charactersTable.name, nameAr: charactersTable.nameAr }).from(charactersTable).where(eq(charactersTable.id, b.character2Id));
      return { id: b.id, character1Name: c1?.name || "", character1NameAr: c1?.nameAr || "", character2Name: c2?.name || "", character2NameAr: c2?.nameAr || "", winner: b.winnerName, confidenceScore: b.confidenceScore, createdAt: b.createdAt.toISOString() };
    }));

    const topChars = await db.select({
      id: charactersTable.id, name: charactersTable.name, nameAr: charactersTable.nameAr,
      animeId: charactersTable.animeId, animeName: animeTable.name, animeNameAr: animeTable.nameAr,
      tier: charactersTable.tier, imageUrl: charactersTable.imageUrl, powerLevel: charactersTable.powerLevel,
      description: charactersTable.description,
      evidenceCount: sql<number>`(select count(*) from evidence where character_id = ${charactersTable.id})::int`,
    }).from(charactersTable).leftJoin(animeTable, eq(charactersTable.animeId, animeTable.id))
      .orderBy(desc(sql`(select count(*) from evidence where character_id = ${charactersTable.id})`)).limit(6);

    res.json({ totalAnime: animeCount.count, totalCharacters: charCount.count, totalBattles: battleCount.count, totalEvidence: evidenceCount.count, recentBattles, topCharacters: topChars });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
