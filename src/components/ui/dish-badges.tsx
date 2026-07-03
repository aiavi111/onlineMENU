import { Flame, Leaf, Sparkles } from "lucide-react";
import type { BadgeKind } from "@/types";
import { cn } from "@/lib/utils";

const STYLES: Record<
  BadgeKind,
  { label: string; className: string; Icon?: typeof Flame; iconClass?: string }
> = {
  popular: { label: "Хит", className: "bg-fg text-onfg" },
  new: {
    label: "Новинка",
    className: "bg-black/45 text-white border border-white/20 backdrop-blur-md",
    Icon: Sparkles,
  },
  spicy: {
    label: "Остро",
    className: "bg-black/45 text-white border border-white/20 backdrop-blur-md",
    Icon: Flame,
    iconClass: "text-flame",
  },
  veg: {
    label: "Вегги",
    className: "bg-black/45 text-white border border-white/20 backdrop-blur-md",
    Icon: Leaf,
    iconClass: "text-leaf",
  },
};

export function DishBadges({
  badges,
  className,
}: {
  badges: BadgeKind[];
  className?: string;
}) {
  if (!badges.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map((b) => {
        const s = STYLES[b];
        return (
          <span
            key={b}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
              s.className,
            )}
          >
            {s.Icon && <s.Icon size={11} className={s.iconClass} />}
            {s.label}
          </span>
        );
      })}
    </div>
  );
}
