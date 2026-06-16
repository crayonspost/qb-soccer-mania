import type { CountryId, EnemyTeam, Formation, Position, Rarity } from "./types";
import argentinaAsset from "@/assets/countries/argentina.jpg.asset.json";
import spainAsset from "@/assets/countries/spain.jpg.asset.json";
import franceAsset from "@/assets/countries/france.jpg.asset.json";
import englandAsset from "@/assets/countries/england.jpg.asset.json";
import portugalAsset from "@/assets/countries/portugal.jpg.asset.json";
import brazilAsset from "@/assets/countries/brazil.jpg.asset.json";
import moroccoAsset from "@/assets/countries/morocco.jpg.asset.json";
import netherlandsAsset from "@/assets/countries/netherlands.jpg.asset.json";

export const COUNTRIES: { id: CountryId; name: string; image: string; color: string }[] = [
  { id: "argentina", name: "阿根廷", image: argentinaAsset.url, color: "#75AADB" },
  { id: "spain", name: "西班牙", image: spainAsset.url, color: "#C60B1E" },
  { id: "france", name: "法國", image: franceAsset.url, color: "#0055A4" },
  { id: "england", name: "英格蘭", image: englandAsset.url, color: "#C8102E" },
  { id: "portugal", name: "葡萄牙", image: portugalAsset.url, color: "#046A38" },
  { id: "brazil", name: "巴西", image: brazilAsset.url, color: "#FEDD00" },
  { id: "morocco", name: "摩洛哥", image: moroccoAsset.url, color: "#C1272D" },
  { id: "netherlands", name: "荷蘭", image: netherlandsAsset.url, color: "#F36C21" },
];

export const COUNTRY_MAP = Object.fromEntries(COUNTRIES.map(c => [c.id, c]));

export const RARITIES: Rarity[] = ["white", "green", "red", "yellow", "blue", "purple"];
export const RARITY_LABEL: Record<Rarity, string> = {
  white: "白", green: "綠", red: "紅", yellow: "黃", blue: "藍", purple: "紫",
};
export const RARITY_COLOR: Record<Rarity, string> = {
  white: "var(--rarity-white)",
  green: "var(--rarity-green)",
  red: "var(--rarity-red)",
  yellow: "var(--rarity-yellow)",
  blue: "var(--rarity-blue)",
  purple: "var(--rarity-purple)",
};
// Drop weights
export const RARITY_WEIGHT: Record<Rarity, number> = {
  white: 40, green: 28, red: 16, yellow: 9, blue: 5, purple: 2,
};
// Base power
export const RARITY_POWER: Record<Rarity, number> = {
  white: 100, green: 180, red: 300, yellow: 480, blue: 720, purple: 1100,
};

export const POSITIONS: Position[] = ["GK", "DF", "MF", "FW"];
export const POSITION_LABEL: Record<Position, string> = {
  GK: "守門員", DF: "後衛", MF: "中場", FW: "前鋒",
};

// Name pool per position — same name + same star can synthesize
export const NAME_POOL: Record<Position, string[]> = {
  GK: ["鋼鐵之牆", "蒼穹守護", "鐵閘王", "神之守門"],
  DF: ["銅牆鐵壁", "金剛防線", "鋼鐵戰士", "鐵衛", "雷霆後衛"],
  MF: ["風之指揮官", "節奏大師", "中場魔術師", "鋼琴家", "天才中場"],
  FW: ["閃電前鋒", "破門機器", "射門狂人", "黃金射手", "傳奇前鋒"],
};

// 20 formations
export const FORMATIONS: Formation[] = [
  { id: "433",  name: "4-3-3 經典",    type: "balanced", shape: [4,3,3], atkMul: 1.05, defMul: 1.0 },
  { id: "442",  name: "4-4-2 雙箭頭",  type: "balanced", shape: [4,4,2], atkMul: 1.0,  defMul: 1.05 },
  { id: "352",  name: "3-5-2 控衡",    type: "control",  shape: [3,5,2], atkMul: 1.02, defMul: 1.02 },
  { id: "451",  name: "4-5-1 中場主宰",type: "control",  shape: [4,5,1], atkMul: 0.95, defMul: 1.12 },
  { id: "532",  name: "5-3-2 鐵桶陣",  type: "defense",  shape: [5,3,2], atkMul: 0.9,  defMul: 1.25 },
  { id: "541",  name: "5-4-1 鎖鏈陣",  type: "defense",  shape: [5,4,1], atkMul: 0.85, defMul: 1.32 },
  { id: "424",  name: "4-2-4 雙翼狂攻",type: "attack",   shape: [4,2,4], atkMul: 1.25, defMul: 0.88 },
  { id: "334",  name: "3-3-4 全攻擊",  type: "attack",   shape: [3,3,4], atkMul: 1.3,  defMul: 0.8 },
  { id: "343",  name: "3-4-3 攻擊三叉戟",type:"attack",  shape: [3,4,3], atkMul: 1.18, defMul: 0.92 },
  { id: "541c", name: "5-4-1 防守反擊", type:"defense",  shape: [5,4,1], atkMul: 0.95, defMul: 1.22 },
  { id: "352c", name: "3-5-2 鑽石中場", type:"control",  shape: [3,5,2], atkMul: 1.08, defMul: 0.98 },
  { id: "433h", name: "4-3-3 高位逼搶", type:"attack",   shape: [4,3,3], atkMul: 1.15, defMul: 0.95 },
  { id: "442d", name: "4-4-2 鑽石",    type:"control",   shape: [4,4,2], atkMul: 1.05, defMul: 1.05 },
  { id: "523",  name: "5-2-3 反擊狂潮", type:"balanced", shape: [5,2,3], atkMul: 1.1,  defMul: 1.05 },
  { id: "415",  name: "4-1-5 死亡前場", type:"attack",   shape: [4,1,5], atkMul: 1.35, defMul: 0.78 },
  { id: "613",  name: "6-1-3 銅牆",     type:"defense",  shape: [6,1,3], atkMul: 0.8,  defMul: 1.4 },
  { id: "631",  name: "6-3-1 烏龜陣",   type:"defense",  shape: [6,3,1], atkMul: 0.78, defMul: 1.45 },
  { id: "262",  name: "2-6-2 中場海嘯", type:"control",  shape: [2,6,2], atkMul: 1.05, defMul: 1.05 },
  { id: "244",  name: "2-4-4 雙刀流",   type:"attack",   shape: [2,4,4], atkMul: 1.4,  defMul: 0.72 },
  { id: "451c", name: "4-5-1 控衡王者", type:"control",  shape: [4,5,1], atkMul: 1.0,  defMul: 1.15 },
];

export const ENEMY_TEAMS: EnemyTeam[] = [
  { id: "tiger",   name: "猛虎軍團",     power: 800,   atk: 420, def: 380 },
  { id: "eagle",   name: "神鷹突擊隊",   power: 1400,  atk: 760, def: 640 },
  { id: "dragon",  name: "龍焰騎士團",   power: 2200,  atk: 1200, def: 1000 },
  { id: "shark",   name: "海王戰艦",     power: 3200,  atk: 1700, def: 1500 },
  { id: "wolf",    name: "蒼狼遠征軍",   power: 4500,  atk: 2400, def: 2100 },
  { id: "phoenix", name: "鳳凰烈焰",     power: 6200,  atk: 3300, def: 2900 },
  { id: "lion",   name: "雄獅王朝",      power: 8500,  atk: 4500, def: 4000 },
  { id: "thunder", name: "雷霆戰神",     power: 11500, atk: 6100, def: 5400 },
  { id: "kraken",  name: "深海巨怪",     power: 15500, atk: 8200, def: 7300 },
  { id: "valkyrie",name: "瓦爾基麗",     power: 20500, atk: 10800, def: 9700 },
  { id: "titan",   name: "泰坦巨人",     power: 27000, atk: 14200, def: 12800 },
  { id: "zeus",    name: "宙斯神諭",     power: 36000, atk: 19000, def: 17000 },
];

export const TIER_ORDER = ["rookie", "amateur", "reserve", "first", "pro", "champion"] as const;
export const TIER_LABEL: Record<typeof TIER_ORDER[number], string> = {
  rookie: "新手賽場",
  amateur: "業餘聯賽",
  reserve: "二軍聯賽",
  first: "一軍聯賽",
  pro: "職業聯賽",
  champion: "冠軍職業聯賽",
};
export const TIER_COUNT: Record<typeof TIER_ORDER[number], number> = {
  rookie: 100, amateur: 100, reserve: 100, first: 100, pro: 100, champion: 100,
};

export const SAVE_SLOTS = 20;
export const PULL_COST = 100; // gold per pull