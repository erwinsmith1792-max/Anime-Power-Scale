import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import {
  useListCharacters,
  useListAnime,
  useAnalyzeBattle,
  useGetBattle,
  getListCharactersQueryKey,
} from "@workspace/api-client-react";
import { Sword, Zap, ChevronDown, RotateCcw, BookOpen, AlertTriangle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SOURCE_PRIORITY: Record<string, number> = {
  manga: 1,
  databook: 2,
  author_statement: 3,
  anime: 4,
  novel: 5,
  other: 6,
};

const SOURCE_LABELS: Record<string, string> = {
  manga: "مانغا",
  databook: "داتابوك",
  author_statement: "تصريح المؤلف",
  anime: "أنمي",
  novel: "رواية",
  other: "مصدر آخر",
};

const CONFIDENCE_COLORS: Record<string, string> = {
  مرتفع: "text-green-400 border-green-400/30 bg-green-400/10",
  متوسط: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  منخفض: "text-red-400 border-red-400/30 bg-red-400/10",
};

type Analysis = {
  id: number;
  character1: any;
  character2: any;
  winner: string | null;
  winnerId: number | null;
  confidenceScore: number;
  confidenceLabel: string;
  reasoning: string;
  reasoningSteps: any[];
  metricComparisons: any[];
  evidenceUsed: any[];
  contradictions: string[];
  limitations: string[];
  verdict: string;
  createdAt: string;
};

export default function BattlePage() {
  const [, setLocation] = useLocation();
  const searchStr = useSearch();
  const searchParams = new URLSearchParams(searchStr);
  const preChar1 = searchParams.get("char1");
  const preChar2 = searchParams.get("char2");

  const [animeId1, setAnimeId1] = useState<string>("all");
  const [animeId2, setAnimeId2] = useState<string>("all");
  const [char1Id, setChar1Id] = useState<string>(preChar1 || "");
  const [char2Id, setChar2Id] = useState<string>(preChar2 || "");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState<"reasoning" | "metrics" | "evidence">("reasoning");
  const { toast } = useToast();

  const { data: animeList } = useListAnime();

  const params1 = animeId1 !== "all" ? { animeId: parseInt(animeId1) } : {};
  const params2 = animeId2 !== "all" ? { animeId: parseInt(animeId2) } : {};

  const { data: chars1 } = useListCharacters(params1, {
    query: { queryKey: getListCharactersQueryKey(params1) },
  });
  const { data: chars2 } = useListCharacters(params2, {
    query: { queryKey: getListCharactersQueryKey(params2) },
  });

  const analyze = useAnalyzeBattle();

  const handleAnalyze = () => {
    if (!char1Id || !char2Id) {
      toast({ title: "اختر شخصيتين", description: "يجب اختيار شخصيتين للمقارنة", variant: "destructive" });
      return;
    }
    if (char1Id === char2Id) {
      toast({ title: "خطأ", description: "لا يمكن مقارنة شخصية بنفسها", variant: "destructive" });
      return;
    }
    analyze.mutate(
      { data: { character1Id: parseInt(char1Id), character2Id: parseInt(char2Id) } },
      {
        onSuccess: (data: any) => setAnalysis(data),
        onError: () => toast({ title: "خطأ", description: "فشل التحليل، حاول مرة أخرى", variant: "destructive" }),
      }
    );
  };

  const reset = () => {
    setAnalysis(null);
    setChar1Id("");
    setChar2Id("");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-foreground mb-2">
            <span className="text-primary">⚔️</span> محرك المعارك
          </h1>
          <p className="text-muted-foreground">تحليل قائم على الأدلة بالذكاء الاصطناعي</p>
        </div>

        {!analysis ? (
          /* Character Selection */
          <div className="bg-card border border-card-border rounded-2xl p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Character 1 */}
              <div>
                <div className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">١</span>
                  الشخصية الأولى
                </div>
                <Select value={animeId1} onValueChange={(v) => { setAnimeId1(v); setChar1Id(""); }}>
                  <SelectTrigger className="mb-3" data-testid="select-anime-1">
                    <SelectValue placeholder="اختر الأنمي" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأنميات</SelectItem>
                    {animeList?.map((a) => <SelectItem key={a.id} value={String(a.id)}>{a.nameAr}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={char1Id} onValueChange={setChar1Id}>
                  <SelectTrigger data-testid="select-char-1">
                    <SelectValue placeholder="اختر الشخصية" />
                  </SelectTrigger>
                  <SelectContent>
                    {chars1?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nameAr} ({c.tier})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {char1Id && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <div className="font-bold text-foreground">
                      {chars1?.find((c) => String(c.id) === char1Id)?.nameAr}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {chars1?.find((c) => String(c.id) === char1Id)?.animeNameAr}
                    </div>
                  </div>
                )}
              </div>

              {/* VS Divider */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-black text-sm">VS</div>
              </div>

              {/* Character 2 */}
              <div>
                <div className="text-sm font-bold text-accent mb-3 flex items-center gap-2">
                  <span className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">٢</span>
                  الشخصية الثانية
                </div>
                <Select value={animeId2} onValueChange={(v) => { setAnimeId2(v); setChar2Id(""); }}>
                  <SelectTrigger className="mb-3" data-testid="select-anime-2">
                    <SelectValue placeholder="اختر الأنمي" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأنميات</SelectItem>
                    {animeList?.map((a) => <SelectItem key={a.id} value={String(a.id)}>{a.nameAr}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={char2Id} onValueChange={setChar2Id}>
                  <SelectTrigger data-testid="select-char-2">
                    <SelectValue placeholder="اختر الشخصية" />
                  </SelectTrigger>
                  <SelectContent>
                    {chars2?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nameAr} ({c.tier})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {char2Id && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <div className="font-bold text-foreground">
                      {chars2?.find((c) => String(c.id) === char2Id)?.nameAr}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {chars2?.find((c) => String(c.id) === char2Id)?.animeNameAr}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={analyze.isPending || !char1Id || !char2Id}
                className="text-lg font-black px-12 gap-3"
                data-testid="btn-analyze-battle"
              >
                {analyze.isPending ? (
                  <>
                    <Zap className="h-5 w-5 animate-pulse" />
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Sword className="h-5 w-5" />
                    حلل المعركة
                  </>
                )}
              </Button>
            </div>

            {analyze.isPending && (
              <div className="mt-4 text-center text-sm text-muted-foreground animate-pulse">
                ⚡ يقوم الذكاء الاصطناعي بتحليل الأدلة وبناء سلسلة الاستدلال...
              </div>
            )}
          </div>
        ) : (
          /* Analysis Result */
          <div>
            {/* Winner Banner */}
            <div className="battle-gradient border border-card-border rounded-2xl p-6 mb-6 text-center glow-gold">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{analysis.character1?.nameAr}</div>
                  <div className="text-xs text-muted-foreground">{analysis.character1?.animeNameAr}</div>
                </div>
                <Sword className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{analysis.character2?.nameAr}</div>
                  <div className="text-xs text-muted-foreground">{analysis.character2?.animeNameAr}</div>
                </div>
              </div>

              {analysis.winner ? (
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Trophy className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-black text-primary">{analysis.winner}</span>
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">الفائز</div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="text-xl font-black text-muted-foreground">تعادل / غير محسوم</div>
                </div>
              )}

              <p className="text-sm text-foreground/80 max-w-2xl mx-auto mb-4 italic">
                "{analysis.verdict}"
              </p>

              <div className="flex items-center justify-center gap-4">
                <Badge className={`${CONFIDENCE_COLORS[analysis.confidenceLabel] || "text-muted-foreground"} border`}>
                  الثقة: {Math.round(analysis.confidenceScore)}% — {analysis.confidenceLabel}
                </Badge>
                <Button variant="outline" size="sm" onClick={reset} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  معركة جديدة
                </Button>
              </div>

              <Progress value={analysis.confidenceScore} className="mt-4 h-2" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 bg-muted p-1 rounded-lg w-fit">
              {(["reasoning", "metrics", "evidence"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  data-testid={`tab-${tab}`}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                    activeTab === tab ? "bg-card text-foreground shadow" : "text-muted-foreground"
                  }`}
                >
                  {tab === "reasoning" ? "سلسلة الاستدلال" : tab === "metrics" ? "المقاييس" : "الأدلة"}
                </button>
              ))}
            </div>

            {activeTab === "reasoning" && (
              <div className="space-y-4">
                {/* Main Reasoning */}
                <div className="bg-card border border-card-border rounded-xl p-5">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    التحليل التفصيلي
                  </h3>
                  <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {analysis.reasoning}
                  </p>
                </div>

                {/* Reasoning Steps */}
                {analysis.reasoningSteps?.length > 0 && (
                  <div className="bg-card border border-card-border rounded-xl p-5">
                    <h3 className="font-bold text-foreground mb-4">خطوات الاستدلال</h3>
                    <div className="space-y-3">
                      {analysis.reasoningSteps.map((step: any) => (
                        <div key={step.step} className="flex gap-3">
                          <div className="bg-primary text-primary-foreground rounded-full w-7 h-7 flex-shrink-0 flex items-center justify-center text-xs font-black">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                            <p className="text-sm font-bold text-foreground mt-1">→ {step.conclusion}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contradictions */}
                {analysis.contradictions?.length > 0 && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
                    <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      تناقضات مكتشفة
                    </h3>
                    <ul className="space-y-2">
                      {analysis.contradictions.map((c: string, i: number) => (
                        <li key={i} className="text-sm text-yellow-200/80 flex gap-2">
                          <span>⚠</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Limitations */}
                {analysis.limitations?.length > 0 && (
                  <div className="bg-muted rounded-xl p-5">
                    <h3 className="font-bold text-muted-foreground mb-3">قيود التحليل</h3>
                    <ul className="space-y-1">
                      {analysis.limitations.map((l: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground flex gap-2">
                          <span>•</span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "metrics" && (
              <div className="space-y-3">
                {analysis.metricComparisons?.map((mc: any) => (
                  <div key={mc.metric} className="bg-card border border-card-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-foreground">{mc.metricAr || mc.metric}</h4>
                      {mc.winner && (
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                          {mc.winner === "character1" ? analysis.character1?.nameAr : analysis.character2?.nameAr} يفوز
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{analysis.character1?.nameAr}</span>
                          <span className="font-bold text-foreground">{mc.character1Score}/10</span>
                        </div>
                        <Progress value={mc.character1Score * 10} className="h-2" />
                      </div>
                      <div className="text-xs text-muted-foreground">VS</div>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{analysis.character2?.nameAr}</span>
                          <span className="font-bold text-foreground">{mc.character2Score}/10</span>
                        </div>
                        <Progress value={mc.character2Score * 10} className="h-2" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{mc.reasoning}</p>
                  </div>
                ))}

                {(!analysis.metricComparisons || analysis.metricComparisons.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">
                    لا توجد بيانات مقاييس متاحة
                  </div>
                )}
              </div>
            )}

            {activeTab === "evidence" && (
              <div className="space-y-3">
                {analysis.evidenceUsed?.map((ev: any) => (
                  <div key={ev.id} className="bg-card border border-card-border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {ev.metric}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            (SOURCE_PRIORITY[ev.sourceType] || 99) <= 2
                              ? "border-primary/30 text-primary"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {SOURCE_LABELS[ev.sourceType] || ev.sourceType}
                        </Badge>
                        {ev.isDirect && (
                          <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">
                            مباشر
                          </Badge>
                        )}
                      </div>
                      <span className={`text-xs font-bold ${
                        ev.confidenceLevel === "high" ? "text-green-400" :
                        ev.confidenceLevel === "medium" ? "text-yellow-400" : "text-red-400"
                      }`}>
                        {ev.confidenceLevel === "high" ? "ثقة عالية" :
                         ev.confidenceLevel === "medium" ? "ثقة متوسطة" : "ثقة منخفضة"}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80">{ev.content}</p>
                    {(ev.seriesName || ev.chapterEpisode) && (
                      <p className="text-xs text-muted-foreground mt-2">
                        📖 {[ev.seriesName, ev.chapterEpisode, ev.pageScene].filter(Boolean).join(" — ")}
                      </p>
                    )}
                  </div>
                ))}

                {(!analysis.evidenceUsed || analysis.evidenceUsed.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">
                    لا توجد أدلة مسجلة لهذه الشخصيات بعد
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
