import { useGame } from "@/game/store";
import { SAVE_SLOTS } from "@/game/constants";
import { useState } from "react";

export function SavesScreen() {
  const s = useGame();
  const [slotName, setSlotName] = useState("");

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-3 text-xs">
        <h2 className="text-base font-black">💾 存檔（{SAVE_SLOTS} 個槽）</h2>
        <p className="text-muted-foreground">資料儲存於你的瀏覽器（localStorage），清除瀏覽器資料會遺失。</p>
      </div>
      <div className="flex gap-2">
        <input
          value={slotName}
          onChange={e => setSlotName(e.target.value)}
          placeholder="存檔名稱（選填）"
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-2">
        {Array.from({ length: SAVE_SLOTS }).map((_, i) => {
          const sv = s.saves[i];
          return (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 text-xs">
              <span className="w-10 text-center font-black text-muted-foreground">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                {sv ? (
                  <>
                    <div className="truncate font-bold">{sv.name || `存檔 ${i + 1}`}</div>
                    <div className="text-muted-foreground">{new Date(sv.savedAt).toLocaleString()} · 💰{sv.data.gold} · 卡{sv.data.inventory.length}</div>
                  </>
                ) : <div className="text-muted-foreground">— 空 —</div>}
              </div>
              <button onClick={() => s.saveTo(i, slotName || `存檔 ${i + 1}`)} className="rounded bg-primary px-2 py-1 font-bold text-primary-foreground">存</button>
              {sv && <button onClick={() => s.loadFrom(i)} className="rounded bg-accent px-2 py-1 font-bold text-white">讀</button>}
              {sv && <button onClick={() => s.deleteSlot(i)} className="rounded bg-destructive px-2 py-1 font-bold text-white">刪</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}