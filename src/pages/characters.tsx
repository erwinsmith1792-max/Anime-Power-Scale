import { useState } from "react";
import { useLocation } from "wouter";
import { useListCharacters, useListAnime, getListCharactersQueryKey } from "@workspace/api-client-react";
import { Search, Sword, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIER_COLORS: Record<string, string> = {
  "S+": "bg-gradient-to-r from-yellow-400 to-orange-500 text-black",
  "S": "bg-gradient-to-r from-yellow-500 to-amber-600 text-black",
  "A+": "bg-gradient-to-r from-slate-300 to-slate-500 text-black",
  "A": "bg-gradient-to-r from-slate-400 to-slate-600 text-black",
  "B+": "bg-gradient-to-r from-amber-700 to-amber-900 text-white",
  "B": "bg-gradient-to-r from-amber-800 to-amber-950 text-white",
};

export default function CharactersPage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [animeId, setAnimeId] = useState<string>("all");
  const [battleMode, setBattleMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const params: { animeId?: number; search?: string } = {};
  if (animeId !== "all") params.animeId = parseInt(animeId);
  if (search) params.search = search;

  const { data: characters, isLoading } = useListCharacters(params, {
    query: { queryKey: getListCharactersQueryKey(params) },
  });
  const { data: animeList } = useListAnime();

  const handleCharacterClick = (charId: number) => {
    if (battleMode) {
      if (selected.includes(charId)) {
        setSelected(selected.filter((id) => id !== charId));
      } else if (selected.length < 2) {
        const newSelected = [...selected, charId];
        setSelected(newSelected);
        if (newSelected.length === 2) {
          setLocation(`/battle?char1=${newSelected[0]}&char2=${newSelected[1]}`);
        }
      }
    } else {
      setLocation(`/character/${charId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground">الشخصيات</h1>
            <p className="text-muted-foreground mt-1">
              {characters?.length ?? 0} شخصية مسجلة
            </p>
          </div>
          <Button
            onClick={() => { setBattleMode(!battleMode); setSelected([]); }}
            variant={battleMode ? "destructive" : "default"}
            className="gap-2"
            data-testid="btn-toggle-battle-mode"
          >
            <Sword className="h-4 w-4" />
            {battleMode ? "إلغاء وضع المعركة" : "اختر للمعركة"}
          </Button>
        </div>

        {battleMode && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6 text-center">
            <p className="text-primary font-bold">
              {selected.length === 0
                ? "اختر الشخصية الأولى"
                : selected.length === 1
                ? "اختر الشخصية الثانية"
                : "جاري التحليل..."}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن شخصية..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
              data-testid="input-search-characters"
            />
          </div>
          <Select value={animeId} onValueChange={setAnimeId}>
            <SelectTrigger className="w-full md:w-64" data-testid="select-anime-filter">
              <SelectValue placeholder="كل الأنميات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنميات</SelectItem>
              {animeList?.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  {a.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {characters?.map((char) => {
              const isSelected = selected.includes(char.id);
              return (
                <button
                  key={char.id}
                  data-testid={`char-card-${char.id}`}
                  onClick={() => handleCharacterClick(char.id)}
                  className={`
                    bg-card border rounded-xl p-4 text-right transition-all cursor-pointer hover:border-primary/50 group
                    ${isSelected ? "border-primary glow-gold ring-2 ring-primary/50" : "border-card-border"}
                    ${battleMode ? "hover:scale-105" : ""}
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${TIER_COLORS[char.tier] || "bg-muted text-muted-foreground"}`}
                    >
                      {char.tier}
                    </span>
                    {isSelected && (
                      <span className="text-primary text-xs font-bold">✓ محدد</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                      🎭
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-foreground text-sm leading-tight">{char.nameAr}</div>
                      <div className="text-xs text-muted-foreground">{char.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className="text-xs border-border">
                      {char.animeNameAr}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{char.evidenceCount} دليل</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!isLoading && characters?.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-muted-foreground text-lg">لا توجد شخصيات تطابق البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
