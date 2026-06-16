import { useGame } from "@/game/store";

export function SettingsScreen() {
  const s = useGame();
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-black">⚙️ 設定</h2>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm">
        <div>
          <div className="font-bold">🔊 音效</div>
          <div className="text-xs text-muted-foreground">比賽進球與抽卡音效（簡易嗶聲）</div>
        </div>
        <button onClick={() => s.toggleSound()}
          className={`rounded-full px-4 py-2 text-xs font-bold ${s.soundOn ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
          {s.soundOn ? "開啟" : "關閉"}
        </button>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm">
        <div>
          <div className="font-bold">💎 加碼資源（測試）</div>
          <div className="text-xs text-muted-foreground">送 1000 💰 + 10 🎟</div>
        </div>
        <button onClick={() => { s.addGold(1000); s.addPulls(10); }}
          className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white">領取</button>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-destructive/40 bg-card p-3 text-sm">
        <div>
          <div className="font-bold text-destructive">⚠ 重置遊戲</div>
          <div className="text-xs text-muted-foreground">會清除國家、卡牌、賽程進度（不影響存檔槽）</div>
        </div>
        <button onClick={() => { if (confirm("確定要重置？")) s.reset(); }}
          className="rounded-full bg-destructive px-4 py-2 text-xs font-bold text-white">重置</button>
      </div>
    </div>
  );
}