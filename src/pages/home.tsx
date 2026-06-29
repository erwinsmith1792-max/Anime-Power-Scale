import { useState } from "react";
import { useLocation } from "wouter";
import { useGetStats, useListAnime } from "@workspace/api-client-react";
import { Sword, Zap, Users, BookOpen, TrendingUp, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: animeList, isLoading: animeLoading } = useListAnime();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 rounded-full px-4 py-1.5 text-sm mb-6">
            <Zap className="h-4 w-4" />
            <span>محرك تحليل الأنمي بالذكاء الاصطناعي</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-4 leading-tight">
            معارك{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-amber-300">
              الأنمي
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            قارن أقوى شخصيات الأنمي والمانغا بتحليل علمي دقيق مدعوم بالأدلة من المصادر الرسمية
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg font-bold px-8 gap-2"
              onClick={() => setLocation("/battle")}
              data-testid="btn-start-battle"
            >
              <Sword className="h-5 w-5" />
              ابدأ المعركة
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg font-bold px-8 gap-2"
              onClick={() => setLocation("/characters")}
              data-testid="btn-browse-characters"
            >
              <Users className="h-5 w-5" />
              تصفح الشخصيات
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "أنمي مدعوم", value: stats?.totalAnime, icon: BookOpen, color: "text-primary" },
            { label: "شخصية", value: stats?.totalCharacters, icon: Users, color: "text-accent" },
            { label: "معركة محللة", value: stats?.totalBattles, icon: Sword, color: "text-chart-4" },
            { label: "دليل مسجل", value: stats?.totalEvidence, icon: TrendingUp, color: "text-chart-3" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-card-border rounded-xl p-5 text-center"
              data-testid={`stat-${stat.label}`}
            >
              <stat.icon className={`h-7 w-7 mx-auto mb-2 ${stat.color}`} />
              {statsLoading ? (
                <Skeleton className="h-8 w-16 mx-auto mb-1" />
              ) : (
                <div className="text-3xl font-black text-foreground">{stat.value ?? 0}</div>
              )}
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Anime list */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-foreground">الأنميات المدعومة</h2>
            <Button variant="ghost" onClick={() => setLocation("/characters")} className="gap-1 text-primary">
              عرض الكل
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          {animeLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {animeList?.map((anime) => (
                <button
                  key={anime.id}
                  data-testid={`anime-card-${anime.id}`}
                  onClick={() => setLocation(`/characters?animeId=${anime.id}`)}
                  className="bg-card border border-card-border rounded-xl p-5 text-right hover:border-primary/50 hover:glow-gold transition-all group cursor-pointer"
                >
                  <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {anime.nameAr}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{anime.name}</div>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {anime.characterCount} شخصية
                    </Badge>
                    <span className="text-xs text-muted-foreground">{anime.genre}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Battles */}
        {stats?.recentBattles && stats.recentBattles.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-foreground">أحدث المعارك</h2>
              <Button variant="ghost" onClick={() => setLocation("/history")} className="gap-1 text-primary">
                عرض الكل
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3">
              {stats.recentBattles.map((battle) => (
                <button
                  key={battle.id}
                  data-testid={`recent-battle-${battle.id}`}
                  onClick={() => setLocation(`/battle/${battle.id}`)}
                  className="bg-card border border-card-border rounded-xl p-4 text-right hover:border-primary/40 transition-all w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-bold">{battle.character1NameAr}</span>
                      <Sword className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-bold">{battle.character2NameAr}</span>
                    </div>
                    {battle.winner && (
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        الفائز: {battle.winner}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-xs text-muted-foreground">
                      الثقة: {Math.round(battle.confidenceScore)}%
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-1">
                      <div
                        className="bg-primary h-1 rounded-full"
                        style={{ width: `${battle.confidenceScore}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
