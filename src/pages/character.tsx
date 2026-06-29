import { useLocation, useParams } from "wouter";
import { useGetCharacter } from "@workspace/api-client-react";
import { Sword, ArrowRight, Shield, Zap, Star, BookOpen } from "lucide-react";
import AdvancedSearch from "@/components/AdvancedSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const TIER_COLORS: Record<string, string> = {
  "S+": "bg-gradient-to-r from-yellow-400 to-orange-500 text-black",
  "S": "bg-gradient-to-r from-yellow-500 to-amber-600 text-black",
  "A+": "bg-gradient-to-r from-slate-300 to-slate-500 text-black",
  "A": "bg-gradient-to-r from-slate-400 to-slate-600 text-black",
  "B+": "bg-gradient-to-r from-amber-700 to-amber-900 text-white",
  "B": "bg-gradient-to-r from-amber-800 to-amber-950 text-white",
};

const METRIC_AR: Record<string, string> = {
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

const SOURCE_AR: Record<string, string> = {
  manga: "مانغا",
  databook: "داتابوك",
  author_statement: "تصريح المؤلف",
  anime: "أنمي",
  novel: "رواية",
  other: "أخرى",
};

export default function CharacterPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = parseInt(params.id || "0");

  const { data: char, isLoading, isError } = useGetCharacter(id, {
    query: { enabled: !!id && !isNaN(id) },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !char) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-muted-foreground text-lg mb-4">الشخصية غير موجودة</p>
          <Button variant="outline" onClick={() => setLocation("/characters")}>
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للشخصيات
          </Button>
        </div>
      </div>
    );
  }

  const forms: string[] = (char as any).forms || [];
  const evidence: any[] = (char as any).evidence || [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back button */}
        <button
          onClick={() => setLocation("/characters")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
        >
          <ArrowRight className="h-4 w-4" />
          العودة للشخصيات
        </button>

        {/* Header Card */}
        <div className="bg-card border border-card-border rounded-2xl p-6 mb-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-2xl shadow-lg">
                💀
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black text-foreground">{char.name}</h1>
                {char.nameAr && char.nameAr !== char.name && (
                  <p className="text-lg text-primary font-bold mt-1">{char.nameAr}</p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge variant="outline" className="text-sm border-border">
                  {(char as any).animeNameAr || (char as any).animeName}
                </Badge>
                <span className="text-muted-foreground text-sm">
                  {(char as any).animeName}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-sm font-black px-3 py-1 rounded-full ${TIER_COLORS[char.tier] || "bg-muted text-muted-foreground"}`}>
                التصنيف: {char.tier}
              </span>
              {(char as any).powerLevel && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  مستوى القوة: <span className="font-bold text-foreground">{(char as any).powerLevel?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {char.description && (
            <p className="text-muted-foreground mt-4 leading-relaxed border-t border-card-border pt-4">
              {char.description}
            </p>
          )}
        </div>

        {/* Forms */}
        {forms.length > 0 && (
          <div className="bg-gradient-to-br from-card to-card/80 border border-amber-500/30 rounded-xl p-5 mb-5 shadow-lg shadow-amber-500/10">
            <h2 className="font-black text-lg bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-3 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-400" />
              الأطوار والتحولات ({forms.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {forms.map((form, i) => (
                <Badge key={i} variant="outline" className="text-sm font-bold border-amber-400/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors">
                  ✨ {form}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Search */}
        <AdvancedSearch characterName={char.name} animeName={(char as any).animeName} />

        {/* Evidence */}
        <div className="bg-gradient-to-br from-card to-card/80 border border-primary/30 rounded-xl p-5 mb-6 shadow-lg shadow-primary/10">
          <h2 className="font-black text-lg bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            الأدلة المسجّلة ({evidence.length})
          </h2>
          {evidence.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              لا توجد أدلة مسجّلة بعد — سيعتمد الذكاء الاصطناعي على معرفته بالأنمي عند التحليل.
            </p>
          ) : (
            <div className="space-y-3">
              {evidence.map((e: any, i: number) => (
                <div key={i} className="border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="outline" className="text-xs font-bold bg-primary/10 border-primary/30 text-primary">
                      {METRIC_AR[e.metric] || e.metric}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-bold bg-amber-500/10 border-amber-500/30 text-amber-400">
                      {SOURCE_AR[e.sourceType] || e.sourceType}
                    </Badge>
                    {e.seriesName && (
                      <span className="text-xs font-semibold text-foreground">{e.seriesName} {e.chapterEpisode}</span>
                    )}
                    {e.isDirect && (
                      <Badge className="text-xs bg-green-500/20 text-green-400 border-green-400/30 font-bold">✓ مباشر</Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize font-bold">{e.confidenceLevel}</Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-relaxed">{e.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Battle CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="gap-3 font-black px-10"
            onClick={() => setLocation(`/battle?char1=${char.id}`)}
          >
            <Sword className="h-5 w-5" />
            اختر هذه الشخصية للمعركة
          </Button>
        </div>

      </div>
    </div>
  );
}
