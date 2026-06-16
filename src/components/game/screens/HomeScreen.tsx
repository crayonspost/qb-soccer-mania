import { useGame } from "@/game/store";
import { COUNTRY_MAP, FORMATIONS, TIER_LABEL, TIER_ORDER } from "@/game/constants";
import { teamStats } from "@/game/sim";
import type { Screen } from "../Shell";

export function HomeScreen({ go }: { go: (s: Screen) => void }) {
  const s = useGame();
  const c = s.country ? COUNTRY_MAP[s.country] : null;
  const formation = FORMATIONS.find(f => f.id === s.formationId)!;
  const lineupCards = s.lineup.map(id => s.inventory.find(x => x.id === id)!).filter(Boolean);
  const stats = teamStats(lineupCards, formation);

  return (
    <div className="space-y-4">
      <section
        className="relative overflow-hidden rounded-2xl p-5 text-white shadow-[var(--shadow-card)]"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute -right-6 -top-6 text-[140px] opacity-20">⚽</div>
        {c && (
          <div className="flex items-center gap-3">
            <img src={c.image} alt={c.name} className="h-20 w-20 rounded-xl object-cover ring-4 ring-white/50" />
            <div>
              <div className="text-xs opacity-80">代表國家</div>
              <div className="text-2xl font-black">{c.name}</div>
              <div className="mt-1 text-xs opacity-90">{formation.name} · 戰力 <b>{stats.power}</b></div>
            </div>
          </div>
        )}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-white/15 p-2"><div className="opacity-80">勝</div><div className="text-lg font-black">{s.stats.wins}</div></div>
          <div className="rounded-lg bg-white/15 p-2"><div className="opacity-80">和</div><div className="text-lg font-black">{s.stats.draws}</div></div>
          <div className="rounded-lg bg-white/15 p-2"><div className="opacity-80">負</div><div className="text-lg font-black">{s.stats.losses}</div></div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { id: "gacha", t: "🎴 抽卡", d: "招募新球員" },
          { id: "lineup", t: "🧩 上陣型", d: "排出11人陣容" },
          { id: "schedule", t: "📅 新手賽程", d: "100 場熱身賽" },
          { id: "worldcup", t: "🏆 世界盃", d: "5 級共 500 場" },
          { id: "synthesis", t: "⭐ 合成屋", d: "同名生星升級" },
          { id: "inventory", t: "📚 卡冊", d: "管理所有球員" },
          { id: "leaderboard", t: "🥇 排行榜", d: "戰績/連勝" },
          { id: "settings", t: "⚙️ 設定", d: "音效/重置" },
        ].map(b => (
          <button key={b.id} onClick={() => go(b.id as Screen)}
            className="rounded-xl border border-border bg-card p-3 text-left shadow hover:-translate-y-0.5 hover:shadow-md transition">
            <div className="text-base font-black">{b.t}</div>
            <div className="text-[11px] text-muted-foreground">{b.d}</div>
          </button>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-2 text-sm font-bold">🏆 世界盃進度</div>
        <div className="grid gap-2">
          {TIER_ORDER.map(t => {
            const matches = s.schedule.filter(m => m.tier === t);
            const won = matches.filter(m => m.completed === "win").length;
            const unlocked = s.unlockedTiers[t];
            return (
              <div key={t} className="flex items-center gap-2 text-xs">
                <span className={`w-28 font-bold ${unlocked ? "" : "opacity-50"}`}>{TIER_LABEL[t]}</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-secondary">
                  <div className="h-full bg-primary transition-all" style={{ width: `${(won / matches.length) * 100}%` }} />
                </div>
                <span className="w-14 text-right text-muted-foreground">{won}/{matches.length}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}