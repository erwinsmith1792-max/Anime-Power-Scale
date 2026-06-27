import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

/**
 * Supabase Client - للوصول إلى قاعدة البيانات
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * جداول قاعدة البيانات
 */
export const TABLES = {
  CHARACTERS: "characters",
  BATTLES: "battles",
  ANALYSIS: "analysis",
  EVIDENCE: "evidence",
  USERS: "users",
};

/**
 * خدمات قاعدة البيانات
 */
export class DatabaseService {
  /**
   * الحصول على جميع الشخصيات
   */
  static async getCharacters() {
    try {
      const { data, error } = await supabase
        .from(TABLES.CHARACTERS)
        .select("*")
        .order("name");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("خطأ في جلب الشخصيات:", error);
      return [];
    }
  }

  /**
   * الحصول على شخصية محددة
   */
  static async getCharacter(id: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CHARACTERS)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("خطأ في جلب الشخصية:", error);
      return null;
    }
  }

  /**
   * البحث عن شخصيات
   */
  static async searchCharacters(query: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CHARACTERS)
        .select("*")
        .ilike("name", `%${query}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("خطأ في البحث عن الشخصيات:", error);
      return [];
    }
  }

  /**
   * حفظ تحليل معركة
   */
  static async saveBattleAnalysis(analysis: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ANALYSIS)
        .insert([
          {
            character1_id: analysis.character1?.id,
            character2_id: analysis.character2?.id,
            winner: analysis.winner,
            confidence_score: analysis.confidenceScore,
            reasoning: analysis.reasoning,
            metrics: analysis.metricComparisons,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error("خطأ في حفظ التحليل:", error);
      return null;
    }
  }

  /**
   * الحصول على سجل المعارك
   */
  static async getBattleHistory(limit = 10) {
    try {
      const { data, error } = await supabase
        .from(TABLES.ANALYSIS)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("خطأ في جلب سجل المعارك:", error);
      return [];
    }
  }

  /**
   * إضافة دليل جديد
   */
  static async addEvidence(evidence: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVIDENCE)
        .insert([
          {
            character_id: evidence.characterId,
            content: evidence.content,
            source_type: evidence.sourceType,
            series_name: evidence.seriesName,
            chapter_episode: evidence.chapterEpisode,
            confidence_level: evidence.confidenceLevel,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error("خطأ في إضافة الدليل:", error);
      return null;
    }
  }

  /**
   * الحصول على أدلة الشخصية
   */
  static async getCharacterEvidence(characterId: string) {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVIDENCE)
        .select("*")
        .eq("character_id", characterId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("خطأ في جلب الأدلة:", error);
      return [];
    }
  }

  /**
   * تحديث شخصية
   */
  static async updateCharacter(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CHARACTERS)
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error("خطأ في تحديث الشخصية:", error);
      return null;
    }
  }

  /**
   * إضافة شخصية جديدة
   */
  static async addCharacter(character: any) {
    try {
      const { data, error } = await supabase
        .from(TABLES.CHARACTERS)
        .insert([
          {
            name: character.name,
            anime_name: character.animeName,
            tier: character.tier,
            description: character.description,
            abilities: character.abilities,
            stats: character.stats,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error("خطأ في إضافة الشخصية:", error);
      return null;
    }
  }
}

export default supabase;
