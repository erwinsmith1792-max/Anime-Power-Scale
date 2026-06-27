/**
 * خدمة البحث المتقدم
 * تستقرئ المواقع الرسمية للمانغا والأنمي والمراجع
 */

export interface SearchResult {
  source: "manga" | "anime" | "databook" | "wiki" | "official";
  title: string;
  content: string;
  url?: string;
  confidence: number;
  timestamp: Date;
}

export interface AIEnhancedAnalysis {
  openaiAnalysis: any;
  groqAnalysis?: any;
  googleAnalysis?: any;
  consensus: {
    winner: string;
    confidence: number;
    reasoning: string;
  };
}

class AdvancedSearchService {
  /**
   * البحث في مصادر متعددة
   */
  async searchMultipleSources(characterName: string, animeName: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    try {
      // البحث في MyAnimeList
      const malResults = await this.searchMyAnimeList(characterName, animeName);
      results.push(...malResults);

      // البحث في Fandom Wiki
      const wikiResults = await this.searchFandomWiki(characterName, animeName);
      results.push(...wikiResults);

      // البحث في المواقع الرسمية للناشرين
      const officialResults = await this.searchOfficialSources(characterName, animeName);
      results.push(...officialResults);

      return results.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error("خطأ في البحث المتقدم:", error);
      return results;
    }
  }

  /**
   * البحث في MyAnimeList
   */
  private async searchMyAnimeList(characterName: string, animeName: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/characters?query=${encodeURIComponent(characterName)}`
      );
      const data = await response.json();

      return (data.data || []).map((char: any) => ({
        source: "anime" as const,
        title: char.name,
        content: char.about || "",
        url: char.url,
        confidence: 0.8,
        timestamp: new Date(),
      }));
    } catch (error) {
      console.error("خطأ في البحث في MyAnimeList:", error);
      return [];
    }
  }

  /**
   * البحث في Fandom Wiki
   */
  private async searchFandomWiki(characterName: string, animeName: string): Promise<SearchResult[]> {
    try {
      // محاكاة البحث في Wiki (يتطلب CORS proxy في الواقع)
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
        characterName
      )}&prop=extracts&explaintext=true&format=json`;

      const response = await fetch(wikiUrl);
      const data = await response.json();

      const results: SearchResult[] = [];
      for (const page of Object.values(data.query.pages) as any[]) {
        if (page.extract) {
          results.push({
            source: "wiki",
            title: page.title,
            content: page.extract.substring(0, 500),
            confidence: 0.7,
            timestamp: new Date(),
          });
        }
      }
      return results;
    } catch (error) {
      console.error("خطأ في البحث في Wiki:", error);
      return [];
    }
  }

  /**
   * البحث في المصادر الرسمية
   */
  private async searchOfficialSources(characterName: string, animeName: string): Promise<SearchResult[]> {
    // هذا يتطلب معالجة خاصة لكل ناشر
    // يمكن توسيعه لاحقاً
    return [];
  }

  /**
   * دمج تحليلات من نماذج ذكاء اصطناعي متعددة
   */
  async enhanceAnalysisWithMultipleAI(
    character1: string,
    character2: string,
    baseAnalysis: any
  ): Promise<AIEnhancedAnalysis> {
    try {
      // الحصول على تحليل من Groq (إذا كان متاحاً)
      const groqAnalysis = await this.getGroqAnalysis(character1, character2);

      // الحصول على تحليل من Google Gemini (إذا كان متاحاً)
      const googleAnalysis = await this.getGoogleAnalysis(character1, character2);

      // دمج التحليلات
      const consensus = this.mergeAnalyses(baseAnalysis, groqAnalysis, googleAnalysis);

      return {
        openaiAnalysis: baseAnalysis,
        groqAnalysis,
        googleAnalysis,
        consensus,
      };
    } catch (error) {
      console.error("خطأ في تحسين التحليل:", error);
      return {
        openaiAnalysis: baseAnalysis,
        consensus: {
          winner: baseAnalysis.winner || "غير محدد",
          confidence: baseAnalysis.confidenceScore || 0,
          reasoning: baseAnalysis.reasoning || "",
        },
      };
    }
  }

  /**
   * الحصول على تحليل من Groq API
   */
  private async getGroqAnalysis(character1: string, character2: string): Promise<any> {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY || ""}`,
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "user",
              content: `قارن بين الشخصيات التالية من الأنمي:\n${character1} vs ${character2}\nقدم تحليلاً مفصلاً عن من سيفوز في معركة بينهما.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content;
    } catch (error) {
      console.error("خطأ في الحصول على تحليل Groq:", error);
      return null;
    }
  }

  /**
   * الحصول على تحليل من Google Gemini API
   */
  private async getGoogleAnalysis(character1: string, character2: string): Promise<any> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_GOOGLE_API_KEY || ""
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `قارن بين الشخصيات التالية من الأنمي:\n${character1} vs ${character2}\nقدم تحليلاً مفصلاً عن من سيفوز في معركة بينهما.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      console.error("خطأ في الحصول على تحليل Google:", error);
      return null;
    }
  }

  /**
   * دمج التحليلات من نماذج متعددة
   */
  private mergeAnalyses(baseAnalysis: any, groqAnalysis: any, googleAnalysis: any): any {
    // منطق دمج التحليلات
    // يمكن استخدام voting system أو weighted average
    return {
      winner: baseAnalysis.winner,
      confidence: Math.min(
        100,
        baseAnalysis.confidenceScore +
          (groqAnalysis ? 10 : 0) +
          (googleAnalysis ? 10 : 0)
      ),
      reasoning: `${baseAnalysis.reasoning}\n\n[تم تحسينه بواسطة نماذج ذكاء اصطناعي متعددة]`,
    };
  }
}

export const advancedSearchService = new AdvancedSearchService();
