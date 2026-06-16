import { useGame } from "@/game/store";
import { COUNTRY_MAP } from "@/game/constants";
import { cn } from "@/lib/utils";
import { useEffect, useState, type ReactNode } from "react";

export type Screen =
  | "home" | "gacha" | "inventory" | "synthesis" | "lineup"
  | "schedule" | "worldcup" | "leaderboard" | "saves" | "settings";

const NAV: { id: Screen; label: string; icon: string }[] = [
  { id: "home", label: "主城", icon: "🏟️" },
  { id: "gacha", label: "抽卡", icon: "🎴" },
  { id: "inventory", label: "卡冊", icon: "📚" },
  { id: "synthesis", label: "合成屋", icon: "⭐" },
  { id: "lineup", label: "陣型", icon: "🧩" },
  { id: "schedule", label: "新手賽程", icon: "📅" },
  { id: "worldcup", label: "世界盃", icon: "🏆" },
  { id: "leaderboard", label: "排行榜", icon: "🥇" },
  { id: "saves", label: "存檔", icon: "💾" },
  { id: "settings", label: "設定", icon: "⚙️" },
];

export function Shell({ screen, setScreen, children }: {
  screen: Screen; setScreen: (s: Screen) => void; children: ReactNode;
}) {
  const gold = useGame(s => s.gold);
  const pulls = useGame(s => s.pulls);
  const country = useGame(s => s.country);
  const c = country ? COUNTRY_MAP[country] : null;

  // hydration guard
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  if (!hydrated) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full text-lg shadow"
                 style={{ background: "var(--gradient-hero)" }}>⚽</div>
            <div>
              <div className="text-sm font-extrabold leading-tight">足球大亂鬥</div>
              <div className="text-[10px] text-muted-foreground">Q版11人放置卡牌</div>
            </div>
          </div>
          {c && (
            <div className="flex items-center gap-2 rounded-full bg-secondary px-2 py-1 text-xs">
              <img src={c.image} className="h-6 w-6 rounded-full object-cover" alt={c.name} />
              <span className="font-bold">{c.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-yellow-100 px-2 py-1 font-bold text-yellow-900">💰 {gold}</span>
            <span className="rounded-full bg-blue-100 px-2 py-1 font-bold text-blue-900">🎟 {pulls}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 pb-24 pt-3">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 py-1.5">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setScreen(n.id)}
              className={cn(
                "flex min-w-[60px] flex-col items-center rounded-lg px-2 py-1 text-[10px] transition",
                screen === n.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <span className="text-base">{n.icon}</span>
              <span className="font-bold">{n.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}