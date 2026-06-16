export type Rarity = "white" | "green" | "red" | "yellow" | "blue" | "purple";
export type Position = "GK" | "DF" | "MF" | "FW";
export type CountryId =
  | "argentina" | "spain" | "france" | "england"
  | "portugal" | "brazil" | "morocco" | "netherlands";

export interface Card {
  id: string;
  country: CountryId;
  name: string;          // template name; same name+star → can star-up
  position: Position;
  rarity: Rarity;
  stars: number;         // 0-6
  atk: number;
  def: number;
}

export interface Formation {
  id: string;
  name: string;
  type: "balanced" | "attack" | "defense" | "control";
  shape: [number, number, number]; // DF-MF-FW (GK is implicit)
  atkMul: number;
  defMul: number;
}

export interface EnemyTeam {
  id: string;
  name: string;
  power: number;
  atk: number;
  def: number;
}

export interface ScheduleMatch {
  id: string;
  tier: "rookie" | "amateur" | "reserve" | "first" | "pro" | "champion";
  index: number;
  enemyId: string;
  basePower: number;
  rewardGold: number;
  rewardPulls: number; // free pulls awarded
  completed?: "win" | "draw" | "lose";
}

export interface SaveSlot {
  id: number;
  name: string;
  savedAt: number;
  data: PersistState;
}

export interface PersistState {
  country: CountryId | null;
  gold: number;
  pulls: number;
  inventory: Card[];
  lineup: (string | null)[]; // 11 card ids
  formationId: string;
  soundOn: boolean;
  schedule: ScheduleMatch[];
  stats: {
    wins: number;
    draws: number;
    losses: number;
    streak: number;
    bestStreak: number;
    bestPower: number;
  };
  unlockedTiers: Record<ScheduleMatch["tier"], boolean>;
}