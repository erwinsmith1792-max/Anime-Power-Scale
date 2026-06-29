import { useLocation } from "wouter";
import { useListBattles } from "@workspace/api-client-react";
import { Sword, Trophy, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const [, setLocation] = useLocation();
  const { data: battles, isLoading } = useListBattles({ limit: 50 });

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground">سجل المعارك</h1>
          <p className="text-muted-foreground mt-1">{battles?.length ?? 0} معركة محللة</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : battles?.length === 0 ? (
          <div className="text-center py-20">
            <Sword className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">لا توجد معارك بعد</p>
            <p className="text-sm text-muted-foreground mt-2">ابدأ أول معركة الآن!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {battles?.map((battle) => (
              <button
                key={battle.id}
                data-testid={`history-battle-${battle.id}`}
                onClick={() => setLocation(`/battle/${battle.id}`)}
                className="w-full bg-card border border-card-border rounded-xl p-5 text-right hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground text-lg">{battle.character1NameAr}</span>
                    <div className="flex items-center gap-1">
                      <Sword className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground font-bold">VS</span>
                    </div>
                    <span className="font-bold text-foreground text-lg">{battle.character2NameAr}</span>
                  </div>
                  {battle.winner ? (
                    <Badge className="bg-primary/20 text-primary border border-primary/30 gap-1">
                      <Trophy className="h-3 w-3" />
                      {battle.winner}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      تعادل
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(battle.createdAt).toLocaleDateString("ar-SA")}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <Progress value={battle.confidenceScore} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {Math.round(battle.confidenceScore)}% ثقة
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
