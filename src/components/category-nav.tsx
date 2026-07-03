"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CATEGORIES } from "@/data/menu";
import { MiniBar } from "@/components/top-bar";
import { cn, haptic } from "@/lib/utils";

export type CategoryFilter = "all" | (typeof CATEGORIES)[number]["id"];

interface CategoryNavProps {
  active: CategoryFilter;
  onChange: (id: CategoryFilter) => void;
}

const ITEMS: { id: CategoryFilter; label: string; emoji?: string }[] = [
  { id: "all", label: "All" },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, emoji: c.emoji })),
];

export function CategoryNav({ active, onChange }: CategoryNavProps) {
  // sentinel: when it leaves the top of the viewport the rail is "stuck"
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
            ? "bg-base/80 backdrop-blur-2xl border-b border-line shadow-[0_12px_32px_-16px_rgba(0,0,0,0.8)] pt-safe"
            : "bg-transparent",
        )}
      >
        <MiniBar visible={stuck} />
        <nav aria-label="Menu categories">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3">
            {ITEMS.map((item) => {
              const isActive = item.id === active;
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
                    !isActive &&
                      "bg-white/[0.06] border border-line text-mute active:bg-white/[0.1]",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="category-pill"
                      className="absolute inset-0 rounded-full bg-fg shadow-lift"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  {item.emoji && (
                    <span aria-hidden className="relative z-10 text-[15px]">
                      {item.emoji}
                    </span>
                  )}
                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      isActive && "text-black",
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
