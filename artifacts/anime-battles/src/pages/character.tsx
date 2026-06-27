import { useLocation, useParams } from "wouter";
import { useGetCharacter } from "@workspace/api-client-react";
import { Sword, ArrowRight, Shield, Zap, Star, BookOpen } from "lucide-react";
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
            <div>
              <h1 className="text-3xl font-black text-foreground">{char.name}</h1>
              {char.nameAr && char.nameAr !== char.name && (
                <p className="text-lg text-muted-foreground mt-1">{char.nameAr}</p>
              )}
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
          <div className="bg-card border border-card-border rounded-xl p-5 mb-5">
            <h2 className="font-black text-foreground mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              الأطوار والتحولات ({forms.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {forms.map((form, i) => (
                <Badge key={i} variant="outline" className="text-sm border-primary/30 bg-primary/5 text-foreground">
                  {form}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Evidence */}
        <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
          <h2 className="font-black text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            الأدلة المسجّلة ({evidence.length})
          </h2>
          {evidence.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              لا توجد أدلة مسجّلة بعد — سيعتمد الذكاء الاصطناعي على معرفته بالأنمي عند التحليل.
            </p>
          ) : (
            <div className="space-y-3">
              {evidence.map((e: any, i: number) => (
                <div key={i} className="border border-card-border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {METRIC_AR[e.metric] || e.metric}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {SOURCE_AR[e.sourceType] || e.sourceType}
                    </Badge>
                    {e.seriesName && (
                      <span className="text-xs text-muted-foreground">{e.seriesName} {e.chapterEpisode}</span>
                    )}
                    {e.isDirect && (
                      <Badge className="text-xs bg-green-500/20 text-green-400 border-green-400/30">مباشر</Badge>
                    )}
                    <Badge variant="outline" className="text-xs capitalize">{e.confidenceLevel}</Badge>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{e.content}</p>
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
