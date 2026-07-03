"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Cake,
  Coffee,
  CookingPot,
  Croissant,
  Flame,
  Salad,
  Soup,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/data/menu";
import { MiniBar } from "@/components/top-bar";
import { cn, haptic } from "@/lib/utils";

export type CategoryFilter = "all" | (typeof CATEGORIES)[number]["id"];

/** фирменные линейные иконки вместо эмодзи — единый штрих, как в лого */
const ICONS: Record<CategoryFilter, LucideIcon> = {
  all: UtensilsCrossed,
  plov: CookingPot,
  lagman: Soup,
  manty: Croissant,
  shashlik: Flame,
  salads: Salad,
  soups: Soup,
  desserts: Cake,
  drinks: Coffee,
};

interface CategoryNavProps {
  active: CategoryFilter;
  onChange: (id: CategoryFilter) => void;
}

const ITEMS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "Всё меню" },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.label })),
];

export function CategoryNav({ active, onChange }: CategoryNavProps) {
  // сентинел: как только он уходит за верх экрана — панель «прилипла»
  const { ref: sentinelRef, inView } = useInView({ initialInView: true });
  const stuck = !inView;
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    chipRefs.current.get(active)?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px -mb-px" />
      <div
        className={cn(
          "sticky top-0 z-40 transition-[background,box-shadow] duration-300",
          stuck
            ? "bg-base/85 backdrop-blur-2xl border-b border-line shadow-[0_10px_28px_-18px_rgba(30,25,15,0.35)] pt-safe"
            : "bg-transparent",
        )}
      >
        <MiniBar visible={stuck} />
        <nav aria-label="Категории меню" className="no-scrollbar overflow-x-auto">
          <div className="mx-auto flex w-max gap-2 px-5 py-3 lg:px-8">
            {ITEMS.map((item) => {
              const isActive = item.id === active;
              const Icon = ICONS[item.id];
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    if (el) chipRefs.current.set(item.id, el);
                  }}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    haptic();
                    onChange(item.id);
                  }}
                  className={cn(
                    "relative flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold whitespace-nowrap cursor-pointer",
                    !isActive && "bg-white border border-line text-mute active:bg-veil",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 rounded-full bg-fg shadow-lift"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon
                    size={15}
                    strokeWidth={2.2}
                    aria-hidden
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      isActive ? "text-onfg" : "text-dim",
                    )}
                  />
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      isActive && "text-onfg",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
