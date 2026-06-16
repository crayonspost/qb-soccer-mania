import type { Card, Formation } from "./types";

export function cardPower(c: Card): number {
  return c.atk + c.def;
}

export function teamStats(cards: Card[], formation: Formation) {
  let atk = 0, def = 0;
  for (const c of cards) { atk += c.atk; def += c.def; }
  return {
    atk: Math.round(atk * formation.atkMul),
    def: Math.round(def * formation.defMul),
    power: Math.round((atk * formation.atkMul) + (def * formation.defMul)),
  };
}

export interface MatchEvent { t: number; team: "home" | "away"; type: "goal" | "save" | "shot"; text: string; }
export interface MatchResult { home: number; away: number; events: MatchEvent[]; }

// Simulate 60 seconds: ~12 chances; outcome based on relative atk vs def.
export function simulateMatch(
  home: { atk: number; def: number; name: string },
  away: { atk: number; def: number; name: string },
  rng: () => number = Math.random,
): MatchResult {
  const events: MatchEvent[] = [];
  let h = 0, a = 0;
  const TICKS = 12;
  for (let i = 0; i < TICKS; i++) {
    const t = Math.round(((i + 0.5) / TICKS) * 60);
    const homeAttacks = rng() < 0.5;
    const atkSide = homeAttacks ? home : away;
    const defSide = homeAttacks ? away : home;
    const team: "home" | "away" = homeAttacks ? "home" : "away";
    const ratio = atkSide.atk / Math.max(1, atkSide.atk + defSide.def);
    // base 0.55 goal chance scaled by ratio
    const goalChance = 0.15 + ratio * 0.6;
    const r = rng();
    if (r < goalChance) {
      if (team === "home") h++; else a++;
      events.push({ t, team, type: "goal", text: `⚽ ${atkSide.name} 進球！` });
    } else if (r < goalChance + 0.15) {
      events.push({ t, team, type: "save", text: `🧤 ${defSide.name} 神撲！` });
    } else {
      events.push({ t, team, type: "shot", text: `🥅 ${atkSide.name} 射偏。` });
    }
  }
  return { home: h, away: a, events };
}