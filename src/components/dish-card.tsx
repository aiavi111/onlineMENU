"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, Star } from "lucide-react";
import { useInView } from "react-intersection-observer";
import type { Dish } from "@/types";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import { DishBadges } from "@/components/ui/dish-badges";
import { FavHeart } from "@/components/fav-heart";
import { haptic, money } from "@/lib/utils";

interface DishCardProps {
  dish: Dish;
  onOpen: (dish: Dish) => void;
}

export function DishCard({ dish, onOpen }: DishCardProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });
  const add = useCart((s) => s.add);
  const fav = useFavorites((s) => s.ids.includes(dish.id));
  const toggleFav = useFavorites((s) => s.toggle);
  const [justAdded, setJustAdded] = useState(false);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic(12);
    const size = dish.sizes?.[0];
    add({
      key: `${dish.id}|${size?.id ?? "std"}`,
      dishId: dish.id,
      name: dish.name,
      image: dish.images[0],
      unitPrice: dish.price + (size?.priceDelta ?? 0),
      sizeLabel: size?.label,
      addOns: [],
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <motion.article
      ref={ref}
      initial={false}
      animate={
        inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.98 }
      }
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onOpen(dish)}
      className="group cursor-pointer rounded-4xl border border-line bg-card p-3 pb-4 shadow-lift"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(dish)}
      aria-label={`${dish.name}, ${money(dish.price)}`}
    >
      {/* photo */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-card2">
        <Image
          src={dish.images[0]}
          alt={dish.name}
          fill
          loading="lazy"
          sizes="(max-width: 430px) 100vw, 400px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-active:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
        <DishBadges badges={dish.badges} className="absolute left-3 top-3" />
        <FavHeart
          active={fav}
          onToggle={() => toggleFav(dish.id)}
          size="sm"
          className="absolute right-3 top-3"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-black/40 border border-white/15 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white/90 tabular-nums">
          {dish.weight} g · {dish.kcal} kcal
        </span>
      </div>

      {/* copy */}
      <div className="px-1.5 pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-bold tracking-tight leading-snug">
            {dish.name}
          </h3>
          <span className="mt-0.5 flex shrink-0 items-center gap-1 text-[13px] font-bold">
            <Star size={12.5} className="fill-star text-star" />
            {dish.rating}
            <span className="font-medium text-dim">({dish.reviews})</span>
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-mute">
          {dish.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[19px] font-extrabold tabular-nums tracking-tight">
            {money(dish.price)}
            {dish.sizes && (
              <span className="ml-1.5 align-middle text-[11.5px] font-semibold text-dim">
                {dish.sizes[0].label}
              </span>
            )}
          </p>
          <motion.button
            whileTap={{ scale: 0.82 }}
            transition={{ type: "spring", stiffness: 520, damping: 24 }}
            onClick={quickAdd}
            aria-label={`Add ${dish.name} to cart`}
            className="grid size-11 place-items-center rounded-full bg-fg text-black shadow-lift cursor-pointer"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={justAdded ? "check" : "plus"}
                initial={{ scale: 0.3, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.3, opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 500, damping: 26 }}
                className="flex"
              >
                {justAdded ? (
                  <Check size={19} strokeWidth={3} />
                ) : (
                  <Plus size={19} strokeWidth={2.8} />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
