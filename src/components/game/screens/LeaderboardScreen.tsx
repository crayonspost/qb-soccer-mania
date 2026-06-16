import { useGame } from "@/game/store";
import { COUNTRY_MAP, FORMATIONS, TIER_LABEL, TIER_ORDER } from "@/game/constants";
import { teamStats } from "@/game/sim";

export function LeaderboardScreen() {
  const s = useGame();
  const f = FORMATIONS.find(x => x.id === s.formationId)!;
  const cards = s.lineup.map(id => s.inventory.find(c => c.id === id)!).filter(Boolean);
  const my = teamStats(cards, f);
  const country = s.country ? COUNTRY_MAP[s.country] : null;

  return (
    <div className="space-y-3">
      <div className="rounded-2xl p-4 text-white shadow" style={{ background: "var(--gradient-hero)" }}>
        <h2 className="text-lg font-black">🥇 個人排行榜</h2>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-white/15 p-2"><div className="opacity-80">總勝場</div><div className="text-lg font-black">{s.stats.wins}</div></div>
          <div className="rounded bg-white/15 p-2"><div className="opacity-80">最佳連勝</div><div className="text-lg font-black">{s.stats.bestStreak}</div></div>
          <div className="rounded bg-white/15 p-2"><div className="opacity-80">當前連勝</div><div className="text-lg font-black">{s.stats.streak}</div></div>
          <div className="rounded bg-white/15 p-2"><div className="opacity-80">當前戰力</div><div className="text-lg font-black">{my.power}</div></div>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="mb-2 text-sm font-bold">🏆 賽事完成率</div>
        {TIER_ORDER.map(t => {
          const matches = s.schedule.filter(m => m.tier === t);
          const won = matches.filter(m => m.completed === "win").length;
          return (
            <div key={t} className="mb-1 flex items-center gap-2 text-xs">
              <span className="w-28">{TIER_LABEL[t]}</span>
              <div className="h-2 flex-1 overflow-hidden rounded bg-secondary"><div className="h-full bg-primary" style={{ width: `${(won / matches.length) * 100}%` }} /></div>
              <span className="w-12 text-right text-muted-foreground">{won}/{matches.length}</span>
            </div>
          );
        })}
      </div>
      {country && (
        <div className="rounded-xl border border-border bg-card p-3 text-xs">
          <div className="mb-1 font-bold">出戰國家</div>
          <div className="flex items-center gap-2">
            <img src={country.image} className="h-10 w-10 rounded object-cover" alt={country.name} />
            <div>
              <div className="text-sm font-bold">{country.name}</div>
              <div className="text-muted-foreground">陣型：{f.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}