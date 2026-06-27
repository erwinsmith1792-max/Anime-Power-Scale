import { Router } from "express";
import { db } from "@workspace/db";
import { battlesTable, charactersTable, animeTable, evidenceTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

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
    if (!char.evidence || char.evidence.length === 0) return "لا توجد أدلة مسجلة في قاعدة البيانات — استخدم معرفتك بالأنمي.";
    return char.evidence.map((e: any) =>
      `[المقياس: ${e.metric} | المصدر: ${e.sourceType} | الثقة: ${e.confidenceLevel} | مباشر: ${e.isDirect ? "نعم" : "لا"}]
المرجع: ${e.seriesName || ""} ${e.chapterEpisode || ""} ${e.pageScene || ""}
الدليل: ${e.content}`
    ).join("\n\n");
  };

  return `أنت محرك تحليل قوى متخصص في مقارنة شخصيات الأنمي والمانغا. لديك معرفة عميقة وشاملة بجميع الأنمي والمانغا الشهيرة.

## قواعد التحليل:
1. استخدم معرفتك الواسعة بالأنمي والمانغا لتقييم قوى الشخصيات — هذا هو المصدر الأساسي للتحليل.
2. الأدلة المسجلة في قاعدة البيانات (إن وُجدت) تعزز تحليلك لكنها ليست شرطاً للحكم.
3. أولوية المصادر: مانغا أصلية > داتابوك رسمي > تصريحات المؤلف > أنمي > مصادر ثانوية.
4. عند تعارض المصادر: اذكر كلا الدليلين وفسّر أيهما أقوى.
5. ميّز دائماً بين: حقائق مباشرة / استنتاجات منطقية / فرضيات.
6. ابنِ التحليل خطوة بخطوة ولا تقفز إلى نتائج.
7. يجب أن تصل إلى حكم واضح — تجنب التعادل إلا إذا كانت القوى متقاربة جداً بشكل حقيقي.

## الشخصية الأولى: ${char1.name} — الطور: ${form1}
السلسلة: ${char1.animeName}
التصنيف: ${char1.tier}
الوصف: ${char1.description || "غير محدد"}

### الأدلة المسجلة لـ ${char1.name} (${form1}):
${buildEvidenceText(char1)}

## الشخصية الثانية: ${char2.name} — الطور: ${form2}
السلسلة: ${char2.animeName}
التصنيف: ${char2.tier}
الوصف: ${char2.description || "غير محدد"}

### الأدلة المسجلة لـ ${char2.name} (${form2}):
${buildEvidenceText(char2)}

${context ? `## سياق إضافي من المستخدم:\n${context}` : ""}

## المطلوب:
أجب بـ JSON صالح فقط (بدون markdown أو نص إضافي). **جميع النصوص يجب أن تكون باللغة العربية** (عدا أسماء الشخصيات والأنمي والمصطلحات التقنية):

{
  "winner": "اسم الفائز أو null في حالة التعادل الحقيقي فقط",
  "winnerKey": "character1 أو character2 أو null",
  "confidenceScore": <رقم 0-100>,
  "confidenceLabel": "High أو Medium أو Low",
  "verdict": "حكم نهائي بجملة واحدة بالعربية",
  "reasoning": "تحليل أكاديمي مفصّل باللغة العربية يشرح المنهجية والأدلة والاستنتاج",
  "reasoningSteps": [
    { "step": 1, "description": "وصف الخطوة بالعربية", "evidenceIds": [], "conclusion": "استنتاج الخطوة بالعربية" }
  ],
  "metricComparisons": [
    {
      "metric": "power",
      "metricAr": "القوة",
      "character1Score": <0-10>,
      "character2Score": <0-10>,
      "winner": "character1 أو character2 أو null",
      "reasoning": "شرح مختصر مبني على الأدلة بالعربية",
      "evidenceIds": []
    }
  ],
  "contradictions": ["تناقض 1 إن وجد بالعربية"],
  "limitations": ["حد تحليلي 1 بالعربية"]
}

المقاييس المطلوب تقييمها: power (القوة), attack_potency (قوة الهجوم), speed (السرعة), durability (الصلابة), battle_iq (ذكاء القتال), hax (القدرات الخاصة), experience (الخبرة), stamina (التحمل), range (المدى), regeneration (التجدد)

مهم جداً: يجب الوصول إلى حكم واضح في كل مقياس ممكن. استخدم معرفتك بالأنمي لتقييم الشخصيات حتى بدون أدلة مسجّلة.`;
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

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

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
