import { useState } from "react";
import { useGame } from "@/game/store";
import { ENEMY_TEAMS, TIER_LABEL, TIER_ORDER } from "@/game/constants";
import { MatchView } from "./MatchView";
import type { ScheduleMatch } from "@/game/types";

export function ScheduleScreen({ worldcup }: { worldcup?: boolean }) {
  const s = useGame();
  const tiers = worldcup ? TIER_ORDER.filter(t => t !== "rookie") : ["rookie" as const];
  const [tier, setTier] = useState<typeof TIER_ORDER[number]>(tiers[0]);
  const [current, setCurrent] = useState<ScheduleMatch | null>(null);

  const matches = s.schedule.filter(m => m.tier === tier);
  const lineupCount = s.lineup.filter(Boolean).length;

  return (
    <div className="space-y-3">
      {worldcup && (
        <div className="flex flex-wrap gap-1">
          {tiers.map(t => {
            const unlocked = s.unlockedTiers[t];
            return (
              <button
                key={t}
                onClick={() => unlocked && setTier(t)}
                disabled={!unlocked}
                className={`rounded-full border px-3 py-1 text-xs ${tier === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"} ${!unlocked ? "opacity-40" : ""}`}
              >{TIER_LABEL[t]}{!unlocked && " 🔒"}</button>
            );
          })}
        </div>
      )}
      <div className="rounded-xl border border-border bg-card p-3 text-xs">
        <div className="font-bold">{worldcup ? "🏆 世界盃" : "📅 新手賽場"} · {TIER_LABEL[tier]}</div>
        <div className="text-muted-foreground">每場 1 分鐘 · 速度可選 1x / 2x / 4x · 平手不延長</div>
        {lineupCount < 11 && <div className="mt-1 text-destructive">⚠ 陣容只有 {lineupCount}/11 人，先去「陣型」一鍵最強！</div>}
      </div>
      <div className="grid gap-1.5">
        {matches.map(m => {
          const enemy = ENEMY_TEAMS.find(e => e.id === m.enemyId)!;
          const done = m.completed;
          return (
            <button
              key={m.id}
              onClick={() => setCurrent(m)}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-2 text-left hover:bg-secondary"
            >
              <span className="grid h-8 w-10 place-items-center rounded bg-primary/10 text-xs font-black text-primary">#{m.index + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-bold">{enemy.name}</div>
                <div className="text-[11px] text-muted-foreground">戰力 {m.basePower} · 💰 {m.rewardGold}{m.rewardPulls ? ` · 🎟 ${m.rewardPulls}` : ""}</div>
              </div>
              {done === "win" && <span className="text-xs font-bold text-primary">勝</span>}
              {done === "draw" && <span className="text-xs font-bold text-muted-foreground">和</span>}
              {done === "lose" && <span className="text-xs font-bold text-destructive">負</span>}
            </button>
          );
        })}
      </div>
      {current && <MatchView match={current} onClose={() => setCurrent(null)} />}
    </div>
  );
}