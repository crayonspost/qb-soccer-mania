import { useEffect, useRef, useState } from "react";
import { useGame } from "@/game/store";
import { ENEMY_TEAMS, FORMATIONS, COUNTRY_MAP } from "@/game/constants";
import { teamStats, simulateMatch, type MatchEvent } from "@/game/sim";
import type { ScheduleMatch } from "@/game/types";

export function MatchView({ match, onClose }: { match: ScheduleMatch; onClose: () => void }) {
  const s = useGame();
  const enemy = ENEMY_TEAMS.find(e => e.id === match.enemyId)!;
  const f = FORMATIONS.find(x => x.id === s.formationId)!;
  const cards = s.lineup.map(id => s.inventory.find(c => c.id === id)!).filter(Boolean);
  const my = teamStats(cards, f);
  const country = s.country ? COUNTRY_MAP[s.country] : null;

  // scale enemy stats to basePower
  const scale = match.basePower / Math.max(1, enemy.atk + enemy.def);
  const enemyScaled = { atk: Math.round(enemy.atk * scale), def: Math.round(enemy.def * scale), name: enemy.name };

  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [t, setT] = useState(0);
  const [score, setScore] = useState({ h: 0, a: 0 });
  const [log, setLog] = useState<MatchEvent[]>([]);
  const [done, setDone] = useState(false);
  const resultRef = useRef<ReturnType<typeof simulateMatch> | null>(null);

  useEffect(() => {
    if (!resultRef.current) {
      resultRef.current = simulateMatch(
        { atk: my.atk, def: my.def, name: country?.name || "我方" },
        enemyScaled,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (done) return;
    const intervalMs = 1000 / speed;
    const id = setInterval(() => {
      setT(prev => {
        const nt = prev + 1;
        const res = resultRef.current!;
        const ev = res.events.filter(e => e.t === nt);
        if (ev.length) {
          setLog(l => [...ev, ...l].slice(0, 20));
          let dh = 0, da = 0;
          for (const e of ev) if (e.type === "goal") { e.team === "home" ? dh++ : da++; }
          if (dh || da) setScore(sc => ({ h: sc.h + dh, a: sc.a + da }));
        }
        if (nt >= 60) {
          setDone(true);
          clearInterval(id);
        }
        return nt;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [speed, done]);

  useEffect(() => {
    if (done) {
      const result = score.h > score.a ? "win" : score.h === score.a ? "draw" : "lose";
      s.recordMatch(result, match.id);
      // chance to drop free pull
      if (result === "win" && Math.random() < 0.3) s.addPulls(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      <div className="flex items-center gap-2 border-b border-border bg-card p-2 text-xs">
        <button onClick={onClose} className="rounded bg-secondary px-2 py-1">← 返回</button>
        <div className="ml-2 font-bold">第 {match.index + 1} 場 vs {enemy.name}</div>
        <div className="ml-auto flex gap-1">
          {[1, 2, 4].map(sp => (
            <button key={sp} onClick={() => setSpeed(sp as 1 | 2 | 4)}
              className={`rounded px-2 py-1 ${speed === sp ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{sp}x</button>
          ))}
        </div>
      </div>

      <div className="p-3" style={{ background: "var(--gradient-pitch)" }}>
        <div className="grid grid-cols-3 items-center gap-2 text-center text-white">
          <div>
            <img src={country?.image} alt="" className="mx-auto h-14 w-14 rounded-lg object-cover ring-2 ring-white" />
            <div className="mt-1 text-sm font-black">{country?.name}</div>
            <div className="text-[10px] opacity-90">戰力 {my.power}</div>
          </div>
          <div>
            <div className="text-5xl font-black tabular-nums">{score.h} - {score.a}</div>
            <div className="text-xs opacity-90">{t}" / 60"</div>
            <div className="mx-auto mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/30">
              <div className="h-full bg-yellow-300 transition-all" style={{ width: `${(t / 60) * 100}%` }} />
            </div>
          </div>
          <div>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-black/40 text-2xl ring-2 ring-white">🤖</div>
            <div className="mt-1 text-sm font-black">{enemy.name}</div>
            <div className="text-[10px] opacity-90">戰力 {match.basePower}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1 text-xs">
          {log.map((e, idx) => (
            <div key={idx} className={`rounded p-2 ${e.type === "goal" ? "bg-yellow-100 font-bold" : "bg-secondary"}`}>
              <span className="font-mono text-muted-foreground">{e.t}"</span> {e.text}
            </div>
          ))}
        </div>
        {done && (
          <div className="mt-4 rounded-xl border-2 border-primary bg-card p-4 text-center">
            <div className="text-xs text-muted-foreground">比賽結束</div>
            <div className="my-2 text-3xl font-black">
              {score.h > score.a ? "🏆 勝利！" : score.h === score.a ? "🤝 平手" : "💔 落敗"}
            </div>
            <div className="text-sm">{score.h} - {score.a}</div>
            {score.h > score.a && (
              <div className="mt-2 text-xs text-muted-foreground">💰 +{match.rewardGold} {match.rewardPulls ? `· 🎟 +${match.rewardPulls}` : ""}</div>
            )}
            <button onClick={onClose} className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">返回賽程</button>
          </div>
        )}
      </div>
    </div>
  );
}