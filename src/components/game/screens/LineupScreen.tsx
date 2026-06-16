import { useState } from "react";
import { useGame } from "@/game/store";
import { FORMATIONS, POSITION_LABEL } from "@/game/constants";
import { CardTile } from "../CardTile";
import { teamStats } from "@/game/sim";
import type { Position } from "@/game/types";

export function LineupScreen() {
  const s = useGame();
  const f = FORMATIONS.find(x => x.id === s.formationId)!;

  const slots: { idx: number; pos: Position; row: number }[] = [];
  slots.push({ idx: 0, pos: "GK", row: 0 });
  let i = 1;
  for (let k = 0; k < f.shape[0]; k++) slots.push({ idx: i++, pos: "DF", row: 1 });
  for (let k = 0; k < f.shape[1]; k++) slots.push({ idx: i++, pos: "MF", row: 2 });
  for (let k = 0; k < f.shape[2]; k++) slots.push({ idx: i++, pos: "FW", row: 3 });

  const [picking, setPicking] = useState<number | null>(null);
  const cards = s.lineup.map(id => s.inventory.find(c => c.id === id) || null);
  const stats = teamStats(cards.filter(Boolean) as any, f);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={s.formationId}
          onChange={e => s.setFormation(e.target.value)}
          className="rounded-lg border border-border bg-card px-2 py-1 text-sm"
        >
          {FORMATIONS.map(f => (
            <option key={f.id} value={f.id}>{f.name} ({f.type === "attack" ? "攻擊" : f.type === "defense" ? "防守" : f.type === "control" ? "控衡" : "均衡"})</option>
          ))}
        </select>
        <button onClick={() => s.autoLineup()} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">一鍵最強</button>
        <div className="ml-auto rounded-lg bg-secondary px-3 py-1.5 text-xs">戰力 <b className="text-primary">{stats.power}</b> · 攻 {stats.atk} / 防 {stats.def}</div>
      </div>

      <div className="relative overflow-hidden rounded-2xl p-3 shadow-inner" style={{ background: "var(--gradient-pitch)" }}>
        <div className="absolute inset-3 rounded-xl border-2 border-white/40" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
        <div className="absolute left-3 right-3 top-1/2 h-px bg-white/40" />
        <div className="relative grid gap-3 py-4">
          {[0, 1, 2, 3].map(row => {
            const rs = slots.filter(s => s.row === row);
            return (
              <div key={row} className="flex justify-around gap-1">
                {rs.map(slot => {
                  const card = cards[slot.idx];
                  return (
                    <button
                      key={slot.idx}
                      onClick={() => setPicking(slot.idx)}
                      className="w-[18%] min-w-[60px]"
                    >
                      {card ? (
                        <CardTile card={card} compact />
                      ) : (
                        <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-white/70 bg-white/10 p-2 text-center text-[10px] text-white">
                          <div className="grid h-full place-items-center">
                            <div>
                              <div className="text-lg">+</div>
                              <div className="font-bold">{POSITION_LABEL[slot.pos]}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {picking !== null && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/50" onClick={() => setPicking(null)}>
          <div className="max-h-[70vh] w-full overflow-y-auto rounded-t-2xl bg-card p-3" onClick={e => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-bold">選擇球員 (位置 {POSITION_LABEL[slots[picking].pos]})</div>
              <button onClick={() => { s.setLineupSlot(picking, null); setPicking(null); }} className="text-xs text-muted-foreground">清空此格</button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {s.inventory
                .slice()
                .sort((a, b) => (b.atk + b.def) - (a.atk + a.def))
                .map(c => {
                  const used = s.lineup.includes(c.id);
                  return (
                    <CardTile key={c.id} card={c} selected={used}
                      onClick={() => { s.setLineupSlot(picking, c.id); setPicking(null); }} />
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}