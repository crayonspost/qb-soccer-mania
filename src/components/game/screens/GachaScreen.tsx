import { useState } from "react";
import { useGame } from "@/game/store";
import { CardTile } from "../CardTile";
import type { Card } from "@/game/types";

export function GachaScreen() {
  const pull = useGame(s => s.pull);
  const gold = useGame(s => s.gold);
  const pulls = useGame(s => s.pulls);
  const [result, setResult] = useState<Card[]>([]);

  function doPull(n: number) { setResult(pull(n)); }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 text-white shadow" style={{ background: "var(--gradient-hero)" }}>
        <div className="text-xs opacity-80">招募球員</div>
        <h2 className="text-2xl font-black">🎴 抽卡屋</h2>
        <p className="mt-1 text-xs opacity-90">免費券優先使用，沒券就花 💰100 / 抽。稀有度：白 &lt; 綠 &lt; 紅 &lt; 黃 &lt; 藍 &lt; <b>紫</b></p>
        <div className="mt-3 flex gap-2">
          <button onClick={() => doPull(1)} disabled={pulls < 1 && gold < 100}
            className="rounded-lg bg-white/95 px-4 py-2 text-sm font-black text-primary shadow disabled:opacity-50">單抽</button>
          <button onClick={() => doPull(10)} disabled={pulls < 1 && gold < 1000}
            className="rounded-lg bg-yellow-300 px-4 py-2 text-sm font-black text-yellow-900 shadow disabled:opacity-50">十連抽</button>
        </div>
      </div>
      {result.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-bold">本次獲得 ({result.length})</div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {result.map(c => <CardTile key={c.id} card={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}