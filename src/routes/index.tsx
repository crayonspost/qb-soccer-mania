import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useGame } from "@/game/store";
import { CountrySelect } from "@/components/game/CountrySelect";
import { Shell, type Screen } from "@/components/game/Shell";
import { HomeScreen } from "@/components/game/screens/HomeScreen";
import { GachaScreen } from "@/components/game/screens/GachaScreen";
import { InventoryScreen } from "@/components/game/screens/InventoryScreen";
import { SynthesisScreen } from "@/components/game/screens/SynthesisScreen";
import { LineupScreen } from "@/components/game/screens/LineupScreen";
import { ScheduleScreen } from "@/components/game/screens/ScheduleScreen";
import { LeaderboardScreen } from "@/components/game/screens/LeaderboardScreen";
import { SavesScreen } from "@/components/game/screens/SavesScreen";
import { SettingsScreen } from "@/components/game/screens/SettingsScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "足球大亂鬥 · Q版11人卡牌足球" },
      { name: "description", content: "Q版11人足球放置卡牌網頁遊戲，抽卡、生星、20種陣型、世界盃500場、完全前端可離線存檔。" },
      { property: "og:title", content: "足球大亂鬥 · Q版卡牌足球" },
      { property: "og:description", content: "選國家、組陣型、模擬比賽，純前端 localStorage 存檔。" },
    ],
  }),
  component: Index,
});

function Index() {
  const country = useGame(s => s.country);
  const [screen, setScreen] = useState<Screen>("home");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  if (!hydrated) return <div className="min-h-screen bg-background" />;
  if (!country) return <CountrySelect />;

  return (
    <Shell screen={screen} setScreen={setScreen}>
      {screen === "home" && <HomeScreen go={setScreen} />}
      {screen === "gacha" && <GachaScreen />}
      {screen === "inventory" && <InventoryScreen />}
      {screen === "synthesis" && <SynthesisScreen />}
      {screen === "lineup" && <LineupScreen />}
      {screen === "schedule" && <ScheduleScreen />}
      {screen === "worldcup" && <ScheduleScreen worldcup />}
      {screen === "leaderboard" && <LeaderboardScreen />}
      {screen === "saves" && <SavesScreen />}
      {screen === "settings" && <SettingsScreen />}
    </Shell>
  );
}
