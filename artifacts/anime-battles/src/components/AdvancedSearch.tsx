import { useState } from "react";
import { Search, Globe, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { advancedSearchService, SearchResult } from "@/services/advancedSearch";

interface AdvancedSearchProps {
  characterName: string;
  animeName: string;
}

export default function AdvancedSearch({ characterName, animeName }: AdvancedSearchProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(characterName);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const searchResults = await advancedSearchService.searchMultipleSources(
        searchQuery,
        animeName
      );
      setResults(searchResults);
    } catch (error) {
      console.error("خطأ في البحث:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "manga":
        return "📖";
      case "anime":
        return "🎬";
      case "databook":
        return "📚";
      case "wiki":
        return "🌐";
      case "official":
        return "✅";
      default:
        return "📄";
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "manga":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "anime":
        return "bg-purple-500/10 border-purple-500/30 text-purple-400";
      case "databook":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "wiki":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "official":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  return (
    <div className="bg-gradient-to-br from-card to-card/80 border border-primary/30 rounded-xl p-6 shadow-lg shadow-primary/10">
      <h3 className="font-black text-lg bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-primary" />
        بحث متقدم في المصادر الرسمية
      </h3>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن شخصية أو مانغا..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="gap-2"
        >
          {isSearching ? (
            <>
              <Zap className="h-4 w-4 animate-pulse" />
              جاري البحث...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              بحث
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result, i) => (
            <div
              key={i}
              className="border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-xs font-bold ${getSourceColor(result.source)}`}>
                    {getSourceIcon(result.source)} {result.source}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(result.confidence * 100)}% دقة
                  </span>
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-2">{result.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {result.content}
              </p>
              {result.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:text-primary/80 mt-2 inline-block"
                >
                  اقرأ المزيد →
                </a>
              )}
            </div>
          ))}
        </div>
      ) : isSearching ? (
        <div className="text-center py-8">
          <Zap className="h-8 w-8 text-primary animate-pulse mx-auto mb-2" />
          <p className="text-muted-foreground">جاري البحث في المصادر الرسمية...</p>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>اضغط على البحث لاستقاء المعلومات من المصادر الرسمية</p>
        </div>
      )}
    </div>
  );
}
