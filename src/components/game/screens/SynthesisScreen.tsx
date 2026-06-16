import { useGame, getInventoryGroups } from "@/game/store";
import { COUNTRY_MAP, POSITION_LABEL, RARITY_COLOR, RARITY_LABEL } from "@/game/constants";

export function SynthesisScreen() {
  const inv = useGame(s => s.inventory);
  const syn = useGame(s => s.synthesize);
  const groups = getInventoryGroups(inv).sort((a, b) => b.cards.length - a.cards.length);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-lg font-black">⭐ 合成屋</h2>
        <p className="text-xs text-muted-foreground">同名同星 <b>3 張</b> 可生 1 星，最多 6 星。每升 1 星攻防 ×1.35。</p>
      </div>
      <div className="grid gap-2">
        {groups.map(g => {
          const c = g.cards[0];
          const country = COUNTRY_MAP[c.country];
          const can = g.cards.length >= 3 && g.stars < 6;
          return (
            <div key={`${g.name}-${g.stars}`} className="flex items-center gap-3 rounded-xl border border-border bg-card p-2">
              <img src={country.image} alt="" className="h-12 w-12 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm font-bold">{g.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  <span className="rounded px-1 text-white" style={{ background: RARITY_COLOR[c.rarity] }}>{RARITY_LABEL[c.rarity]}</span>
                  {" · "}{POSITION_LABEL[c.position]} · {"★".repeat(g.stars) || "0★"} · 共 {g.cards.length} 張
                </div>
              </div>
              <button
                onClick={() => syn(g.name, g.stars)}
                disabled={!can}
                className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
              >生星</button>
            </div>
          );
        })}
        {groups.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">還沒有任何球員，先去抽卡吧！</div>}
      </div>
    </div>
  );
}