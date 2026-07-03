"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import type { Dish } from "@/types";
import { DishCard } from "@/components/dish-card";
import { DishCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { plural } from "@/lib/utils";

interface DishGridProps {
  dishes: Dish[];
  loading: boolean;
  heading: string;
  onOpen: (dish: Dish) => void;
  onReset: () => void;
}

export function DishGrid({ dishes, loading, heading, onOpen, onReset }: DishGridProps) {
  if (loading) {
    return (
      <div
        className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-5 px-5 pt-6 lg:grid-cols-2 lg:gap-6 lg:px-8 xl:grid-cols-3 2xl:grid-cols-4"
        aria-busy="true"
        aria-label="Загружаем меню"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <DishCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 pt-5 lg:px-8">
      <div className="mb-4 flex items-baseline justify-between px-1">
        <h2 className="text-[22px] font-extrabold tracking-tight">{heading}</h2>
        <span className="text-[13px] font-medium text-dim tabular-nums">
          {dishes.length} {plural(dishes.length, ["блюдо", "блюда", "блюд"])}
        </span>
      </div>

      {dishes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 rounded-4xl border border-line bg-card px-8 py-14 text-center"
        >
          <span className="grid size-16 place-items-center rounded-full bg-veil border border-line">
            <SearchX size={26} className="text-dim" />
          </span>
          <div>
            <p className="text-[16px] font-bold">Ничего не нашлось</p>
            <p className="mt-1 text-[13.5px] text-mute">
              Попробуйте другой запрос или сбросьте фильтры.
            </p>
          </div>
          <Button variant="glass" size="sm" onClick={onReset}>
            Сбросить всё
          </Button>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {dishes.map((dish) => (
              <motion.div
                key={dish.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <DishCard dish={dish} onOpen={onOpen} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
