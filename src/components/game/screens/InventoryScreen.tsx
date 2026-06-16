import { useState } from "react";
import { useGame } from "@/game/store";
import { CardTile } from "../CardTile";
import { POSITION_LABEL, POSITIONS, RARITIES, RARITY_LABEL } from "@/game/constants";
import type { Position, Rarity } from "@/game/types";

export function InventoryScreen() {
  const inv = useGame(s => s.inventory);
  const sell = useGame(s => s.sellCard);
  const [posF, setPosF] = useState<Position | "all">("all");
  const [rarF, setRarF] = useState<Rarity | "all">("all");
  const filtered = inv
    .filter(c => posF === "all" || c.position === posF)
    .filter(c => rarF === "all" || c.rarity === rarF)
    .sort((a, b) => (b.atk + b.def) - (a.atk + a.def));
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        <button onClick={() => setPosF("all")} className={chip(posF === "all")}>全部位置</button>
        {POSITIONS.map(p => (
          <button key={p} onClick={() => setPosF(p)} className={chip(posF === p)}>{POSITION_LABEL[p]}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        <button onClick={() => setRarF("all")} className={chip(rarF === "all")}>全部稀有</button>
        {RARITIES.map(r => (
          <button key={r} onClick={() => setRarF(r)} className={chip(rarF === r)}>{RARITY_LABEL[r]}</button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">共 {filtered.length} 張</div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {filtered.map(c => (
          <CardTile key={c.id} card={c} selected={selected === c.id} onClick={() => setSelected(selected === c.id ? null : c.id)} />
        ))}
      </div>
      {selected && (
        <div className="fixed bottom-16 left-1/2 z-20 -translate-x-1/2 rounded-full bg-card p-2 shadow-lg ring-1 ring-border">
          <button onClick={() => { sell(selected); setSelected(null); }}
            className="rounded-full bg-destructive px-4 py-2 text-xs font-bold text-white">出售（換金幣）</button>
        </div>
      )}
    </div>
  );
}

function chip(active: boolean) {
  return `rounded-full border px-3 py-1 text-xs ${active ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card"}`;
}