import { useState, useEffect } from "react";
import { Zap, Shield, Heart, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BattleSimulationProps {
  character1: any;
  character2: any;
  analysis: any;
}

interface RoundResult {
  round: number;
  char1Action: string;
  char2Action: string;
  char1Damage: number;
  char2Damage: number;
  char1HP: number;
  char2HP: number;
  winner?: string;
}

const ACTIONS = [
  { name: "هجوم قوي", damage: 15, defense: 0, icon: "⚡" },
  { name: "هجوم متوازن", damage: 10, defense: 3, icon: "🗡️" },
  { name: "دفاع قوي", damage: 2, defense: 15, icon: "🛡️" },
  { name: "هجوم سريع", damage: 8, defense: 1, icon: "💨" },
  { name: "قدرة خاصة", damage: 20, defense: 5, icon: "✨" },
];

export default function BattleSimulation({ character1, character2, analysis }: BattleSimulationProps) {
  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [char1HP, setChar1HP] = useState(100);
  const [char2HP, setChar2HP] = useState(100);
  const [battleEnded, setBattleEnded] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const simulateBattle = async () => {
    setIsSimulating(true);
    setRounds([]);
    setChar1HP(100);
    setChar2HP(100);
    setBattleEnded(false);
    setWinner(null);

    let hp1 = 100;
    let hp2 = 100;
    const newRounds: RoundResult[] = [];
    let round = 1;

    while (hp1 > 0 && hp2 > 0 && round <= 10) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // اختيار الإجراءات بناءً على المقاييس
      const char1Stats = analysis?.metricComparisons || [];
      const char2Stats = analysis?.metricComparisons || [];

      const char1Speed = char1Stats.find((m: any) => m.metric === "speed")?.character1Score || 5;
      const char2Speed = char2Stats.find((m: any) => m.metric === "speed")?.character2Score || 5;

      const char1Action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      const char2Action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];

      // حساب الضرر مع الأخذ بعين الاعتبار الدفاع والسرعة
      let damage1 = Math.max(0, char1Action.damage - char2Action.defense + (char1Speed > char2Speed ? 2 : 0));
      let damage2 = Math.max(0, char2Action.damage - char1Action.defense + (char2Speed > char1Speed ? 2 : 0));

      hp1 = Math.max(0, hp1 - damage2);
      hp2 = Math.max(0, hp2 - damage1);

      setChar1HP(hp1);
      setChar2HP(hp2);

      const roundResult: RoundResult = {
        round,
        char1Action: char1Action.name,
        char2Action: char2Action.name,
        char1Damage: damage1,
        char2Damage: damage2,
        char1HP: hp1,
        char2HP: hp2,
      };

      if (hp1 <= 0 || hp2 <= 0) {
        roundResult.winner = hp1 > hp2 ? character1.name : character2.name;
        setWinner(roundResult.winner);
        setBattleEnded(true);
      }

      newRounds.push(roundResult);
      setRounds(newRounds);
      round++;
    }

    if (hp1 > 0 && hp2 > 0) {
      const finalWinner = hp1 > hp2 ? character1.name : character2.name;
      setWinner(finalWinner);
      setBattleEnded(true);
    }

    setIsSimulating(false);
  };

  return (
    <div className="bg-gradient-to-br from-card to-card/80 border border-primary/30 rounded-xl p-6 shadow-lg shadow-primary/10">
      <h3 className="font-black text-lg bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent mb-4 flex items-center gap-2">
        <Sword className="h-5 w-5 text-primary" />
        محاكاة المواجهة
      </h3>

      {/* HP Bars */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-foreground">{character1.name}</span>
            <span className="text-sm font-bold text-primary">{Math.round(char1HP)} / 100</span>
          </div>
          <Progress value={char1HP} className="h-4" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-foreground">{character2.name}</span>
            <span className="text-sm font-bold text-accent">{Math.round(char2HP)} / 100</span>
          </div>
          <Progress value={char2HP} className="h-4" />
        </div>
      </div>

      {/* Battle Log */}
      {rounds.length > 0 && (
        <div className="bg-muted/30 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {rounds.map((round, i) => (
              <div key={i} className="text-xs border-b border-primary/20 pb-2 last:border-b-0">
                <div className="font-bold text-primary mb-1">الجولة {round.round}</div>
                <div className="grid grid-cols-2 gap-2 text-foreground">
                  <div>
                    <span className="text-yellow-400">{round.char1Action}</span>
                    <span className="text-red-400 ml-2">-{round.char2Damage} HP</span>
                  </div>
                  <div className="text-right">
                    <span className="text-yellow-400">{round.char2Action}</span>
                    <span className="text-red-400 ml-2">-{round.char1Damage} HP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winner */}
      {battleEnded && winner && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4 text-center">
          <div className="text-lg font-black text-primary mb-1">🏆 الفائز: {winner}</div>
          <div className="text-xs text-muted-foreground">بعد {rounds.length} جولات</div>
        </div>
      )}

      {/* Simulate Button */}
      <Button
        onClick={simulateBattle}
        disabled={isSimulating}
        className="w-full gap-2 font-black"
      >
        {isSimulating ? (
          <>
            <Zap className="h-4 w-4 animate-pulse" />
            جاري المحاكاة...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            محاكاة المواجهة
          </>
        )}
      </Button>
    </div>
  );
}
