import { Router } from "express";
import { db } from "@workspace/db";
import { battlesTable, charactersTable, animeTable, evidenceTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

const router = Router();

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const METRICS = [
  { key: "power", ar: "القوة" },
  { key: "attack_potency", ar: "القوة التدميرية" },
  { key: "speed", ar: "السرعة" },
  { key: "durability", ar: "التحمل" },
  { key: "battle_iq", ar: "الذكاء القتالي" },
  { key: "hax", ar: "القدرات الخاصة" },
  { key: "experience", ar: "الخبرة" },
  { key: "stamina", ar: "القدرة على الاستمرار" },
  { key: "range", ar: "المدى" },
  { key: "regeneration", ar: "التجدد" },
];

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

function buildAnalysisPrompt(char1: any, char2: any, context?: string) {
  const buildEvidenceText = (char: any) => {
    if (!char.evidence || char.evidence.length === 0) {
      return "لا توجد أدلة مسجلة لهذه الشخصية بعد.";
    }
    return char.evidence.map((e: any) =>
      `[${e.metric} | المصدر: ${e.sourceType} | الثقة: ${e.confidenceLevel} | مباشر: ${e.isDirect ? "نعم" : "لا"}]
المرجع: ${e.seriesName || ""} ${e.chapterEpisode || ""} ${e.pageScene || ""}
الدليل: ${e.content}`
    ).join("\n\n");
  };

  return `أنت محرك تحليل قائم على الأدلة لمقارنة شخصيات الأنمي والمانغا. مهمتك هي إجراء مقارنة دقيقة وعلمية تماماً كما يفعل الباحث الأكاديمي.

## قواعد الاستدلال الصارمة:
1. لا تستنتج أي نتيجة دون دليل مباشر
2. رتّب المصادر: مانغا أصلية > داتابوك رسمي > تصريحات المؤلف > أنمي > مصادر ثانوية
3. عند التعارض: اعرض كلا الدليلين ووضّح أيهما أقوى ولماذا
4. إذا لم تكن هناك أدلة كافية: قل ذلك صراحةً بدلاً من التخمين
5. ميّز دائماً بين: حقائق مباشرة / استنتاجات منطقية / فرضيات
6. ابنِ الاستنتاج خطوة بخطوة ولا تقفز مباشرة للحكم

## الشخصية الأولى: ${char1.nameAr} (${char1.name})
الأنمي: ${char1.animeNameAr || char1.animeName}
المستوى: ${char1.tier}
الوصف: ${char1.description || "غير متاح"}

### أدلة ${char1.nameAr}:
${buildEvidenceText(char1)}

## الشخصية الثانية: ${char2.nameAr} (${char2.name})
الأنمي: ${char2.animeNameAr || char2.animeName}
المستوى: ${char2.tier}
الوصف: ${char2.description || "غير متاح"}

### أدلة ${char2.nameAr}:
${buildEvidenceText(char2)}

${context ? `## سياق إضافي من المستخدم:\n${context}` : ""}

## المطلوب منك:
أجرِ تحليلاً شاملاً وأخرج JSON بهذا الشكل بالضبط (لا تضف أي نص خارج JSON):

{
  "winner": "اسم الرابح بالعربية أو null إذا كانت المعركة متكافئة أو لا يمكن الحسم",
  "winnerKey": "character1 أو character2 أو null",
  "confidenceScore": رقم من 0 إلى 100,
  "confidenceLabel": "مرتفع أو متوسط أو منخفض",
  "verdict": "حكم نهائي مختصر بجملة واحدة",
  "reasoning": "تحليل شامل ومفصل بالعربية يشرح المنهجية والأدلة والاستنتاج",
  "reasoningSteps": [
    {
      "step": 1,
      "description": "وصف الخطوة",
      "evidenceIds": [],
      "conclusion": "استنتاج الخطوة"
    }
  ],
  "metricComparisons": [
    {
      "metric": "power",
      "metricAr": "القوة",
      "character1Score": رقم من 0 إلى 10,
      "character2Score": رقم من 0 إلى 10,
      "winner": "character1 أو character2 أو null",
      "reasoning": "شرح مختصر بالعربية مع ذكر الدليل",
      "evidenceIds": []
    }
  ],
  "contradictions": ["تناقض 1 إذا وجد", "تناقض 2"],
  "limitations": ["قيود التحليل: غياب أدلة، تعارضات غير محسومة، إلخ"]
}

المقاييس التي يجب تقييمها (إذا كانت هناك أدلة): power, attack_potency, speed, durability, battle_iq, hax, experience, stamina, range, regeneration

تذكر: الجودة الأكاديمية مطلوبة. كل حكم يجب أن يكون مدعوماً بدليل محدد.`;
}

router.post("/battles/analyze", async (req, res) => {
  try {
    const { character1Id, character2Id, context } = req.body;

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

    const prompt = buildAnalysisPrompt(char1, char2, context);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
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
        winner: null,
        winnerKey: null,
        confidenceScore: 50,
        confidenceLabel: "متوسط",
        verdict: "تعذّر تحليل النتيجة بشكل كامل",
        reasoning: rawText,
        reasoningSteps: [],
        metricComparisons: [],
        contradictions: [],
        limitations: ["حدث خطأ في تحليل البيانات"],
      };
    }

    const winnerId = analysis.winnerKey === "character1" ? character1Id
      : analysis.winnerKey === "character2" ? character2Id : null;
    const winnerName = analysis.winner || null;

    const evidenceIds = [
      ...char1.evidence.map((e: any) => e.id),
      ...char2.evidence.map((e: any) => e.id),
    ];

    const [battle] = await db.insert(battlesTable).values({
      character1Id,
      character2Id,
      winnerId,
      winnerName,
      confidenceScore: analysis.confidenceScore || 50,
      confidenceLabel: analysis.confidenceLabel || "متوسط",
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
      winner: winnerName,
      winnerId,
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
    res.status(500).json({ error: "Failed to analyze battle" });
  }
});

router.get("/battles/history", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const battles = await db
      .select({
        id: battlesTable.id,
        character1Id: battlesTable.character1Id,
        character2Id: battlesTable.character2Id,
        winner: battlesTable.winnerName,
        confidenceScore: battlesTable.confidenceScore,
        createdAt: battlesTable.createdAt,
      })
      .from(battlesTable)
      .orderBy(desc(battlesTable.createdAt))
      .limit(limit);

    const result = await Promise.all(battles.map(async (b) => {
      const [c1] = await db.select({ name: charactersTable.name, nameAr: charactersTable.nameAr })
        .from(charactersTable).where(eq(charactersTable.id, b.character1Id));
      const [c2] = await db.select({ name: charactersTable.name, nameAr: charactersTable.nameAr })
        .from(charactersTable).where(eq(charactersTable.id, b.character2Id));
      return {
        id: b.id,
        character1Name: c1?.name || "",
        character1NameAr: c1?.nameAr || "",
        character2Name: c2?.name || "",
        character2NameAr: c2?.nameAr || "",
        winner: b.winner,
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

    const allEvidence = [...(char1?.evidence || []), ...(char2?.evidence || [])];

    res.json({
      id: battle.id,
      character1: char1,
      character2: char2,
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

    const recentBattlesRaw = await db
      .select({
        id: battlesTable.id,
        character1Id: battlesTable.character1Id,
        character2Id: battlesTable.character2Id,
        winner: battlesTable.winnerName,
        confidenceScore: battlesTable.confidenceScore,
        createdAt: battlesTable.createdAt,
      })
      .from(battlesTable)
      .orderBy(desc(battlesTable.createdAt))
      .limit(5);

    const recentBattles = await Promise.all(recentBattlesRaw.map(async (b) => {
      const [c1] = await db.select({ name: charactersTable.name, nameAr: charactersTable.nameAr })
        .from(charactersTable).where(eq(charactersTable.id, b.character1Id));
      const [c2] = await db.select({ name: charactersTable.name, nameAr: charactersTable.nameAr })
        .from(charactersTable).where(eq(charactersTable.id, b.character2Id));
      return {
        id: b.id,
        character1Name: c1?.name || "",
        character1NameAr: c1?.nameAr || "",
        character2Name: c2?.name || "",
        character2NameAr: c2?.nameAr || "",
        winner: b.winner,
        confidenceScore: b.confidenceScore,
        createdAt: b.createdAt.toISOString(),
      };
    }));

    const topChars = await db
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
        evidenceCount: sql<number>`(select count(*) from evidence where character_id = ${charactersTable.id})::int`,
      })
      .from(charactersTable)
      .leftJoin(animeTable, eq(charactersTable.animeId, animeTable.id))
      .orderBy(desc(sql`(select count(*) from evidence where character_id = ${charactersTable.id})`))
      .limit(6);

    res.json({
      totalAnime: animeCount.count,
      totalCharacters: charCount.count,
      totalBattles: battleCount.count,
      totalEvidence: evidenceCount.count,
      recentBattles,
      topCharacters: topChars,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
