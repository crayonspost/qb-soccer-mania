import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Card, CountryId, PersistState, Rarity, SaveSlot, ScheduleMatch } from "./types";
import {
  ENEMY_TEAMS, FORMATIONS, NAME_POOL, POSITIONS, RARITY_POWER,
  RARITY_WEIGHT, RARITIES, TIER_COUNT, TIER_ORDER, SAVE_SLOTS,
} from "./constants";

function rid() { return Math.random().toString(36).slice(2, 10); }

function rollRarity(): Rarity {
  const total = RARITIES.reduce((s, r) => s + RARITY_WEIGHT[r], 0);
  let n = Math.random() * total;
  for (const r of RARITIES) { n -= RARITY_WEIGHT[r]; if (n <= 0) return r; }
  return "white";
}

export function makeCard(country: CountryId): Card {
  const pos = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
  const rarity = rollRarity();
  const names = NAME_POOL[pos];
  const name = names[Math.floor(Math.random() * names.length)];
  const base = RARITY_POWER[rarity];
  // Bias atk/def by position
  const atkBias = pos === "FW" ? 0.65 : pos === "MF" ? 0.55 : pos === "DF" ? 0.4 : 0.3;
  const atk = Math.round(base * atkBias * (0.9 + Math.random() * 0.2));
  const def = Math.round(base * (1 - atkBias) * (0.9 + Math.random() * 0.2));
  return { id: rid(), country, name, position: pos, rarity, stars: 0, atk, def };
}

function buildSchedule(): ScheduleMatch[] {
  const out: ScheduleMatch[] = [];
  for (const tier of TIER_ORDER) {
    const count = TIER_COUNT[tier];
    for (let i = 0; i < count; i++) {
      const enemy = ENEMY_TEAMS[(TIER_ORDER.indexOf(tier) * 2 + Math.floor(i / 10)) % ENEMY_TEAMS.length];
      const tierIdx = TIER_ORDER.indexOf(tier);
      const basePower = Math.round(enemy.power * (0.6 + (i / count) * 1.4) * (1 + tierIdx * 0.4));
      out.push({
        id: `${tier}-${i}`,
        tier, index: i,
        enemyId: enemy.id,
        basePower,
        rewardGold: 40 + tierIdx * 60 + Math.floor(i / 10) * 20,
        rewardPulls: i % 10 === 9 ? 1 : 0,
      });
    }
  }
  return out;
}

function defaultState(): PersistState {
  return {
    country: null,
    gold: 500,
    pulls: 10,
    inventory: [],
    lineup: Array(11).fill(null),
    formationId: FORMATIONS[0].id,
    soundOn: true,
    schedule: buildSchedule(),
    stats: { wins: 0, draws: 0, losses: 0, streak: 0, bestStreak: 0, bestPower: 0 },
    unlockedTiers: { rookie: true, amateur: false, reserve: false, first: false, pro: false, champion: false },
  };
}

interface Store extends PersistState {
  saves: (SaveSlot | null)[];
  // actions
  reset: () => void;
  selectCountry: (c: CountryId) => void;
  pull: (n: number) => Card[];
  addGold: (n: number) => void;
  addPulls: (n: number) => void;
  synthesize: (name: string, stars: number) => boolean;
  sellCard: (cardId: string) => void;
  setFormation: (id: string) => void;
  setLineupSlot: (idx: number, cardId: string | null) => void;
  autoLineup: () => void;
  recordMatch: (result: "win" | "draw" | "lose", scheduleId: string) => void;
  toggleSound: () => void;
  saveTo: (slot: number, name: string) => void;
  loadFrom: (slot: number) => void;
  deleteSlot: (slot: number) => void;
}

function emptySaves(): (SaveSlot | null)[] {
  return Array(SAVE_SLOTS).fill(null);
}

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      ...defaultState(),
      saves: emptySaves(),

      reset: () => set({ ...defaultState(), saves: get().saves }),

      selectCountry: (c) => set({ country: c }),

      pull: (n) => {
        const s = get();
        if (!s.country) return [];
        const cards: Card[] = [];
        let gold = s.gold;
        let pulls = s.pulls;
        for (let i = 0; i < n; i++) {
          if (pulls > 0) pulls--;
          else if (gold >= 100) gold -= 100;
          else break;
          cards.push(makeCard(s.country));
        }
        set({ gold, pulls, inventory: [...s.inventory, ...cards] });
        return cards;
      },

      addGold: (n) => set({ gold: get().gold + n }),
      addPulls: (n) => set({ pulls: get().pulls + n }),

      synthesize: (name, stars) => {
        const s = get();
        const matches = s.inventory.filter(c => c.name === name && c.stars === stars);
        if (matches.length < 3 || stars >= 6) return false;
        const [keep, ...rest] = matches;
        const consumed = new Set([rest[0].id, rest[1].id]);
        const newInv = s.inventory
          .filter(c => !consumed.has(c.id))
          .map(c => c.id === keep.id
            ? { ...c, stars: c.stars + 1, atk: Math.round(c.atk * 1.35), def: Math.round(c.def * 1.35) }
            : c);
        // remove from lineup if consumed
        const lineup = s.lineup.map(id => id && consumed.has(id) ? null : id);
        set({ inventory: newInv, lineup });
        return true;
      },

      sellCard: (cardId) => {
        const s = get();
        const card = s.inventory.find(c => c.id === cardId);
        if (!card) return;
        const reward = Math.round((card.atk + card.def) * 0.2);
        set({
          inventory: s.inventory.filter(c => c.id !== cardId),
          lineup: s.lineup.map(id => id === cardId ? null : id),
          gold: s.gold + reward,
        });
      },

      setFormation: (id) => set({ formationId: id, lineup: Array(11).fill(null) }),

      setLineupSlot: (idx, cardId) => {
        const lineup = [...get().lineup];
        // remove cardId from any other slot
        if (cardId) {
          for (let i = 0; i < lineup.length; i++) if (lineup[i] === cardId) lineup[i] = null;
        }
        lineup[idx] = cardId;
        set({ lineup });
      },

      autoLineup: () => {
        const s = get();
        const f = FORMATIONS.find(f => f.id === s.formationId)!;
        const slots: { idx: number; pos: "GK" | "DF" | "MF" | "FW" }[] = [];
        slots.push({ idx: 0, pos: "GK" });
        let i = 1;
        for (let k = 0; k < f.shape[0]; k++) slots.push({ idx: i++, pos: "DF" });
        for (let k = 0; k < f.shape[1]; k++) slots.push({ idx: i++, pos: "MF" });
        for (let k = 0; k < f.shape[2]; k++) slots.push({ idx: i++, pos: "FW" });
        const used = new Set<string>();
        const lineup: (string | null)[] = Array(11).fill(null);
        for (const slot of slots) {
          const pick = s.inventory
            .filter(c => !used.has(c.id) && c.position === slot.pos)
            .sort((a, b) => (b.atk + b.def) - (a.atk + a.def))[0];
          if (pick) { lineup[slot.idx] = pick.id; used.add(pick.id); }
        }
        // fill remaining with best available
        for (let j = 0; j < 11; j++) {
          if (lineup[j]) continue;
          const pick = s.inventory.filter(c => !used.has(c.id))
            .sort((a, b) => (b.atk + b.def) - (a.atk + a.def))[0];
          if (pick) { lineup[j] = pick.id; used.add(pick.id); }
        }
        set({ lineup });
      },

      recordMatch: (result, scheduleId) => {
        const s = get();
        const sched = s.schedule.map(m => m.id === scheduleId ? { ...m, completed: result } : m);
        const m = s.schedule.find(x => x.id === scheduleId);
        const stats = { ...s.stats };
        if (result === "win") {
          stats.wins++;
          stats.streak++;
          stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
        } else if (result === "draw") {
          stats.draws++;
        } else {
          stats.losses++;
          stats.streak = 0;
        }
        const goldGain = m && (result === "win" ? m.rewardGold : result === "draw" ? Math.round(m.rewardGold / 2) : 0);
        const pullGain = m && result === "win" ? m.rewardPulls : 0;
        // tier unlock: when 80% of current tier won, unlock next
        const unlocked = { ...s.unlockedTiers };
        if (m) {
          const tierMatches = sched.filter(x => x.tier === m.tier);
          const wonInTier = tierMatches.filter(x => x.completed === "win").length;
          if (wonInTier >= Math.floor(TIER_COUNT[m.tier] * 0.8)) {
            const idx = TIER_ORDER.indexOf(m.tier);
            const next = TIER_ORDER[idx + 1];
            if (next) unlocked[next] = true;
          }
        }
        set({
          schedule: sched,
          stats,
          gold: s.gold + (goldGain || 0),
          pulls: s.pulls + (pullGain || 0),
          unlockedTiers: unlocked,
        });
      },

      toggleSound: () => set({ soundOn: !get().soundOn }),

      saveTo: (slot, name) => {
        const s = get();
        const slots = [...s.saves];
        slots[slot] = {
          id: slot, name, savedAt: Date.now(),
          data: {
            country: s.country, gold: s.gold, pulls: s.pulls,
            inventory: s.inventory, lineup: s.lineup, formationId: s.formationId,
            soundOn: s.soundOn, schedule: s.schedule, stats: s.stats,
            unlockedTiers: s.unlockedTiers,
          },
        };
        set({ saves: slots });
      },
      loadFrom: (slot) => {
        const sv = get().saves[slot];
        if (!sv) return;
        set({ ...sv.data });
      },
      deleteSlot: (slot) => {
        const slots = [...get().saves];
        slots[slot] = null;
        set({ saves: slots });
      },
    }),
    {
      name: "football-cards-save",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? window.localStorage : ({
        getItem: () => null, setItem: () => {}, removeItem: () => {},
      } as unknown as Storage))),
    }
  )
);

export function getInventoryGroups(inv: Card[]) {
  const map = new Map<string, Card[]>();
  for (const c of inv) {
    const k = `${c.name}::${c.stars}`;
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(c);
  }
  return [...map.entries()].map(([k, cards]) => {
    const [name, stars] = k.split("::");
    return { name, stars: Number(stars), cards };
  });
}