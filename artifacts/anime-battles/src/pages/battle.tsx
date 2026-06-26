import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  useListCharacters,
  useListAnime,
  useAnalyzeBattle,
  getListCharactersQueryKey,
} from "@workspace/api-client-react";
import { Sword, Zap, RotateCcw, BookOpen, AlertTriangle, Trophy, ChevronDown } from "lucide-react";
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

const SOURCE_LABELS: Record<string, string> = {
  manga: "Manga",
  databook: "Databook",
  author_statement: "Author Statement",
  anime: "Anime",
  novel: "Novel",
  other: "Other",
};

const METRIC_LABELS: Record<string, string> = {
  power: "القوة",
  attack_potency: "قوة الهجوم",
  speed: "السرعة",
  durability: "الصلابة",
  battle_iq: "ذكاء القتال",
  hax: "القدرات الخاصة",
  experience: "الخبرة",
  stamina: "التحمل",
  range: "المدى",
  regeneration: "التجدد",
};

type Analysis = {
  id: number;
  character1: any;
  character2: any;
  character1Form: string;
  character2Form: string;
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

function FormSelector({ forms, value, onChange, placeholder }: { forms: string[]; value: string; onChange: (v: string) => void; placeholder: string }) {
  const displayForms = forms && forms.length > 0 ? forms : ["Standard"];
  if (displayForms.length === 1) {
    return (
      <div className="mt-2 px-3 py-2 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-dashed border-card-border">
        Form: <span className="text-foreground font-medium">{displayForms[0]}</span>
      </div>
    );
  }
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="mt-2">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {displayForms.map((f) => (
          <SelectItem key={f} value={f}>{f}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

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
  const [form1, setForm1] = useState<string>("");
  const [form2, setForm2] = useState<string>("");
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

  const char1Data = chars1?.find((c) => String(c.id) === char1Id);
  const char2Data = chars2?.find((c) => String(c.id) === char2Id);

  const char1Forms: string[] = (char1Data as any)?.forms || [];
  const char2Forms: string[] = (char2Data as any)?.forms || [];

  const getEffectiveForm = (forms: string[], selectedForm: string) => {
    if (forms.length === 0) return "Standard";
    if (selectedForm && forms.includes(selectedForm)) return selectedForm;
    return forms[0];
  };

  const handleChar1Change = (id: string) => {
    setChar1Id(id);
    setForm1("");
  };

  const handleChar2Change = (id: string) => {
    setChar2Id(id);
    setForm2("");
  };

  const handleAnalyze = () => {
    if (!char1Id || !char2Id) {
      toast({ title: "اختر شخصيتين", description: "يجب اختيار شخصيتين للمقارنة", variant: "destructive" });
      return;
    }
    if (char1Id === char2Id) {
      toast({ title: "خطأ", description: "لا يمكن مقارنة شخصية بنفسها", variant: "destructive" });
      return;
    }

    const ef1 = getEffectiveForm(char1Forms, form1);
    const ef2 = getEffectiveForm(char2Forms, form2);

    analyze.mutate(
      {
        data: {
          character1Id: parseInt(char1Id),
          character2Id: parseInt(char2Id),
          character1Form: ef1,
          character2Form: ef2,
        },
      },
      {
        onSuccess: (data: any) => setAnalysis(data),
        onError: (err: any) => {
          console.error("Battle analysis error:", err);
          toast({ title: "خطأ", description: "فشل التحليل، حاول مرة أخرى", variant: "destructive" });
        },
      }
    );
  };

  const reset = () => {
    setAnalysis(null);
    setChar1Id("");
    setChar2Id("");
    setForm1("");
    setForm2("");
  };

  const tierColor = (tier: string) => {
    const t = tier?.toUpperCase();
    if (t === "S+") return "text-amber-400";
    if (t === "S") return "text-yellow-400";
    if (t === "A+") return "text-purple-400";
    if (t === "A") return "text-blue-400";
    return "text-gray-400";
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
          <div className="bg-card border border-card-border rounded-2xl p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-8 relative">
              {/* VS center badge */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-black text-sm shadow-lg">VS</div>
              </div>

              {/* Character 1 */}
              <div>
                <div className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">١</span>
                  الشخصية الأولى
                </div>

                <Select value={animeId1} onValueChange={(v) => { setAnimeId1(v); setChar1Id(""); setForm1(""); }}>
                  <SelectTrigger className="mb-3">
                    <SelectValue placeholder="اختر الأنمي" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأنميات</SelectItem>
                    {animeList?.map((a) => <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={char1Id} onValueChange={handleChar1Change}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشخصية" />
                  </SelectTrigger>
                  <SelectContent>
                    {chars1?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} <span className="text-muted-foreground text-xs">({c.tier})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {char1Id && char1Data && (
                  <div className="mt-3">
                    <div className="p-3 bg-muted rounded-lg mb-2">
                      <div className="font-bold text-foreground">{char1Data.name}</div>
                      <div className="text-xs text-muted-foreground">{char1Data.animeName}</div>
                      <Badge className="mt-1 text-xs" variant="outline">
                        <span className={tierColor(char1Data.tier)}>{char1Data.tier}</span>
                      </Badge>
                    </div>
                    <FormSelector
                      forms={char1Forms}
                      value={form1}
                      onChange={setForm1}
                      placeholder="اختر الطور"
                    />
                    {form1 && (
                      <div className="mt-1 text-xs text-primary">
                        ✓ الطور المختار: <span className="font-bold">{form1}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Character 2 */}
              <div>
                <div className="text-sm font-bold text-accent mb-3 flex items-center gap-2">
                  <span className="bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">٢</span>
                  الشخصية الثانية
                </div>

                <Select value={animeId2} onValueChange={(v) => { setAnimeId2(v); setChar2Id(""); setForm2(""); }}>
                  <SelectTrigger className="mb-3">
                    <SelectValue placeholder="اختر الأنمي" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأنميات</SelectItem>
                    {animeList?.map((a) => <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={char2Id} onValueChange={handleChar2Change}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشخصية" />
                  </SelectTrigger>
                  <SelectContent>
                    {chars2?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} <span className="text-muted-foreground text-xs">({c.tier})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {char2Id && char2Data && (
                  <div className="mt-3">
                    <div className="p-3 bg-muted rounded-lg mb-2">
                      <div className="font-bold text-foreground">{char2Data.name}</div>
                      <div className="text-xs text-muted-foreground">{char2Data.animeName}</div>
                      <Badge className="mt-1 text-xs" variant="outline">
                        <span className={tierColor(char2Data.tier)}>{char2Data.tier}</span>
                      </Badge>
                    </div>
                    <FormSelector
                      forms={char2Forms}
                      value={form2}
                      onChange={setForm2}
                      placeholder="اختر الطور"
                    />
                    {form2 && (
                      <div className="mt-1 text-xs text-accent">
                        ✓ الطور المختار: <span className="font-bold">{form2}</span>
                      </div>
                    )}
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
          /* ===== ANALYSIS RESULT ===== */
          <div>
            {/* Winner Banner */}
            <div className="battle-gradient border border-card-border rounded-2xl p-6 mb-6 text-center glow-gold">
              <div className="flex justify-center gap-2 items-center mb-4">
                <div className="text-center">
                  <div className="text-xl font-black text-foreground">{analysis.character1?.name}</div>
                  <div className="text-xs text-muted-foreground">{analysis.character1?.animeName}</div>
                  <div className="text-xs text-primary mt-1 font-medium">{analysis.character1Form}</div>
                </div>
                <div className="mx-4 text-3xl font-black text-muted-foreground">VS</div>
                <div className="text-center">
                  <div className="text-xl font-black text-foreground">{analysis.character2?.name}</div>
                  <div className="text-xs text-muted-foreground">{analysis.character2?.animeName}</div>
                  <div className="text-xs text-accent mt-1 font-medium">{analysis.character2Form}</div>
                </div>
              </div>

              {analysis.winner ? (
                <div>
                  <div className="flex items-center justify-center gap-2 text-2xl font-black text-primary mb-2">
                    <Trophy className="h-6 w-6" />
                    الفائز: {analysis.winner}
                  </div>
                  <div className="text-sm text-muted-foreground max-w-lg mx-auto">{analysis.verdict}</div>
                </div>
              ) : (
                <div className="text-xl font-black text-yellow-400">⚖️ تعادل / غير حاسم</div>
              )}

              <div className="mt-4 flex justify-center items-center gap-3">
                <span className="text-sm text-muted-foreground">نسبة الثقة:</span>
                <div className="flex items-center gap-2">
                  <Progress value={analysis.confidenceScore} className="w-32 h-2" />
                  <span className="text-sm font-bold text-primary">{analysis.confidenceScore}%</span>
                  <Badge variant="outline" className="text-xs">{analysis.confidenceLabel}</Badge>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {(["reasoning", "metrics", "evidence"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab ? "bg-primary text-primary-foreground" : "bg-card border border-card-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "reasoning" ? "التحليل" : tab === "metrics" ? "المقاييس" : "الأدلة"}
                </button>
              ))}
            </div>

            {/* Reasoning Tab */}
            {activeTab === "reasoning" && (
              <div className="space-y-4">
                {analysis.reasoningSteps?.length > 0 && (
                  <div className="bg-card border border-card-border rounded-xl p-5">
                    <h3 className="font-black text-foreground mb-4 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" /> سلسلة الاستدلال
                    </h3>
                    <div className="space-y-3">
                      {analysis.reasoningSteps.map((step: any, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                            {step.step || i + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{step.description}</div>
                            {step.conclusion && (
                              <div className="text-xs text-muted-foreground mt-1">→ {step.conclusion}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-card border border-card-border rounded-xl p-5">
                  <h3 className="font-black text-foreground mb-3">التحليل الكامل</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap" dir="ltr">
                    {analysis.reasoning}
                  </p>
                </div>

                {analysis.contradictions?.length > 0 && (
                  <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
                    <h3 className="font-black text-yellow-400 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> تناقضات في المصادر
                    </h3>
                    <ul className="space-y-1">
                      {analysis.contradictions.map((c: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.limitations?.length > 0 && (
                  <div className="bg-muted rounded-xl p-4">
                    <h3 className="font-bold text-foreground mb-2">حدود التحليل</h3>
                    <ul className="space-y-1">
                      {analysis.limitations.map((l: string, i: number) => (
                        <li key={i} className="text-xs text-muted-foreground">• {l}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === "metrics" && (
              <div className="bg-card border border-card-border rounded-xl p-5">
                <h3 className="font-black text-foreground mb-4">مقارنة المقاييس</h3>
                {analysis.metricComparisons?.length > 0 ? (
                  <div className="space-y-4">
                    {analysis.metricComparisons.map((m: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-foreground">
                            {m.metricAr || METRIC_LABELS[m.metric] || m.metric}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {m.winner === "character1"
                              ? analysis.character1?.name
                              : m.winner === "character2"
                              ? analysis.character2?.name
                              : "تعادل"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs text-muted-foreground w-24 text-right truncate">{analysis.character1?.name}</span>
                          <div className="flex-1 flex gap-1 items-center">
                            <Progress value={(m.character1Score / 10) * 100} className="flex-1 h-2" />
                            <span className="text-xs font-bold text-primary w-6">{m.character1Score}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-24 text-right truncate">{analysis.character2?.name}</span>
                          <div className="flex-1 flex gap-1 items-center">
                            <Progress value={(m.character2Score / 10) * 100} className="flex-1 h-2" />
                            <span className="text-xs font-bold text-accent w-6">{m.character2Score}</span>
                          </div>
                        </div>
                        {m.reasoning && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.reasoning}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">لا توجد بيانات مقاييس مفصّلة.</p>
                )}
              </div>
            )}

            {/* Evidence Tab */}
            {activeTab === "evidence" && (
              <div className="bg-card border border-card-border rounded-xl p-5">
                <h3 className="font-black text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> الأدلة المستخدمة ({analysis.evidenceUsed?.length || 0})
                </h3>
                {analysis.evidenceUsed?.length > 0 ? (
                  <div className="space-y-3">
                    {analysis.evidenceUsed.map((e: any, i: number) => (
                      <div key={i} className="border border-card-border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">{SOURCE_LABELS[e.sourceType] || e.sourceType}</Badge>
                          <span className="text-xs text-muted-foreground">{e.seriesName} {e.chapterEpisode}</span>
                          {e.isDirect && <Badge className="text-xs bg-green-500/20 text-green-400 border-green-400/30">Direct</Badge>}
                          <Badge variant="outline" className="text-xs capitalize">{e.confidenceLevel}</Badge>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed" dir="ltr">{e.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">لا توجد أدلة مسجّلة لهذه الشخصيات حتى الآن.</p>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                معركة جديدة
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
