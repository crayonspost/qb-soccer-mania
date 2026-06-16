import type { Card } from "@/game/types";
import { COUNTRY_MAP, POSITION_LABEL, RARITY_COLOR, RARITY_LABEL } from "@/game/constants";
import { cn } from "@/lib/utils";

export function CardTile({ card, onClick, selected, compact }: {
  card: Card; onClick?: () => void; selected?: boolean; compact?: boolean;
}) {
  const country = COUNTRY_MAP[card.country];
  return (
    <button
      onClick={onClick}
      style={{ borderColor: `var(--rarity-${card.rarity})` }}
      className={cn(
        "group relative flex flex-col rounded-xl border-2 bg-card text-left shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-lg overflow-hidden",
        selected && "ring-2 ring-primary",
        compact ? "w-full" : "w-full"
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <img src={country.image} alt={country.name} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-1.5 text-[10px] font-bold">
          <span
            className="rounded px-1.5 py-0.5 text-white"
            style={{ background: RARITY_COLOR[card.rarity] }}
          >{RARITY_LABEL[card.rarity]}</span>
          <span className="rounded bg-black/60 px-1.5 py-0.5 text-white">{POSITION_LABEL[card.position]}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-1.5 text-white">
          <div className="text-[10px] opacity-80">{country.name}</div>
          <div className="truncate text-[11px] font-bold">{card.name}</div>
          <div className="text-[10px] text-yellow-300">{"★".repeat(card.stars) || "☆"}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 p-1.5 text-[10px]">
        <div className="rounded bg-secondary px-1 py-0.5 text-center"><span className="text-muted-foreground">攻</span> <b>{card.atk}</b></div>
        <div className="rounded bg-secondary px-1 py-0.5 text-center"><span className="text-muted-foreground">防</span> <b>{card.def}</b></div>
      </div>
    </button>
  );
}