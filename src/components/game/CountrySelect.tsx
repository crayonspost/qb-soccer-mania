import { COUNTRIES } from "@/game/constants";
import { useGame } from "@/game/store";

export function CountrySelect() {
  const select = useGame(s => s.selectCountry);
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-pitch)" }}>
      <div className="mx-auto max-w-5xl px-4 py-8 text-white">
        <div className="mb-6 text-center">
          <div className="text-xs opacity-80">遊客模式</div>
          <h1 className="text-3xl font-black drop-shadow">⚽ 選擇你的國家</h1>
          <p className="mt-2 text-sm opacity-90">選定之後不能更改 — 開始你的足球大亂鬥之旅！</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COUNTRIES.map(c => (
            <button
              key={c.id}
              onClick={() => select(c.id)}
              className="group overflow-hidden rounded-2xl border-2 border-white/40 bg-white/10 text-left shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-white"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-105" />
              </div>
              <div className="p-2 text-center">
                <div className="text-lg font-black">{c.name}</div>
                <div className="text-[10px] opacity-80">點擊選定</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}