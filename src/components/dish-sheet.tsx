"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Star, TriangleAlert, X } from "lucide-react";
import type { Dish } from "@/types";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import { AnimatedMoney } from "@/components/ui/animated-money";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { DishBadges } from "@/components/ui/dish-badges";
import { Segmented } from "@/components/ui/segmented";
import { Stepper } from "@/components/ui/stepper";
import { FavHeart } from "@/components/fav-heart";
import { cn, haptic, money } from "@/lib/utils";

interface DishSheetProps {
  dish: Dish | null;
  onClose: () => void;
}

export function DishSheet({ dish, onClose }: DishSheetProps) {
  // keep last dish rendered during the exit animation
  const lastDish = useRef<Dish | null>(null);
  if (dish) lastDish.current = dish;
  const shown = dish ?? lastDish.current;

  return (
    <BottomSheet open={!!dish} onClose={onClose} maxHeight="94dvh">
      {shown && <DishSheetBody key={shown.id} dish={shown} onClose={onClose} />}
    </BottomSheet>
  );
}

/* ────────────────────────────────────────────────────────── */

function DishSheetBody({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const add = useCart((s) => s.add);
  const fav = useFavorites((s) => s.ids.includes(dish.id));
  const toggleFav = useFavorites((s) => s.toggle);

  const [sizeId, setSizeId] = useState(dish.sizes?.[0]?.id ?? "std");
  const [extras, setExtras] = useState<string[]>([]);
  const [sauces, setSauces] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const size = dish.sizes?.find((s) => s.id === sizeId);
  const extrasSum = extras.reduce(
    (n, id) => n + (dish.extras.find((e) => e.id === id)?.price ?? 0),
    0,
  );
  const saucesSum = sauces.reduce(
    (n, id) => n + (dish.sauces.find((e) => e.id === id)?.price ?? 0),
    0,
  );
  const unitPrice = dish.price + (size?.priceDelta ?? 0) + extrasSum + saucesSum;
  const total = unitPrice * qty;

  const toggle = (list: string[], setList: (v: string[]) => void, id: string) => {
    haptic();
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const addToCart = () => {
    if (added) return;
    haptic(14);
    const addOnNames = [
      ...extras.map((id) => dish.extras.find((e) => e.id === id)?.name ?? ""),
      ...sauces.map((id) => dish.sauces.find((e) => e.id === id)?.name ?? ""),
    ].filter(Boolean);
    add({
      key: [dish.id, sizeId, ...extras, ...sauces, note.trim()].join("|"),
      dishId: dish.id,
      name: dish.name,
      image: dish.images[0],
      unitPrice,
      sizeLabel: size?.label,
      addOns: addOnNames,
      note: note.trim() || undefined,
      qty,
    });
    setAdded(true);
    setTimeout(onClose, 620);
  };

  return (
    <div className="flex min-h-0 flex-col">
      <Gallery dish={dish} onClose={onClose} />

      <div className="space-y-6 px-6 pb-8 pt-5">
        {/* title row */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-[24px] font-extrabold leading-tight tracking-tight">
              {dish.name}
            </h2>
            <FavHeart active={fav} onToggle={() => toggleFav(dish.id)} size="sm" />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] font-medium text-mute">
            <span className="flex items-center gap-1 font-bold text-fg">
              <Star size={13.5} className="fill-star text-star" />
              {dish.rating}
            </span>
            <span>({dish.reviews})</span>
            <span className="text-dim">·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {dish.cookTime} min
            </span>
            <span className="text-dim">·</span>
            <span className="tabular-nums">{dish.weight} g</span>
          </div>
          <p className="mt-3 text-[14.5px] leading-relaxed text-mute">
            {dish.description}
          </p>
        </div>

        {/* nutrition */}
        <div className="grid grid-cols-4 gap-2" aria-label="Nutrition facts">
          {(
            [
              [dish.kcal, "kcal"],
              [dish.protein, "protein"],
              [dish.fat, "fat"],
              [dish.carbs, "carbs"],
            ] as const
          ).map(([value, label], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, type: "spring", stiffness: 300, damping: 26 }}
              className="rounded-2xl border border-line bg-white/[0.04] py-3 text-center"
            >
              <p className="text-[15px] font-extrabold tabular-nums">
                {value}
                {label !== "kcal" && <span className="text-[11px] font-bold"> g</span>}
              </p>
              <p className="mt-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-dim">
                {label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ingredients */}
        <section>
          <SectionLabel>Ingredients</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {dish.ingredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full border border-line bg-white/[0.05] px-3 py-1.5 text-[12.5px] font-medium text-mute"
              >
                {ing}
              </span>
            ))}
          </div>
          {dish.allergens.length > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-dim">
              <TriangleAlert size={13} />
              Contains: {dish.allergens.join(", ")}
            </p>
          )}
        </section>

        {/* size */}
        {dish.sizes && (
          <section>
            <SectionLabel>Size</SectionLabel>
            <Segmented
              groupId={`size-${dish.id}`}
              value={sizeId}
              onChange={setSizeId}
              options={dish.sizes.map((s) => ({
                id: s.id,
                label: s.label,
                hint: s.priceDelta > 0 ? `+${money(s.priceDelta)}` : undefined,
              }))}
            />
          </section>
        )}

        {/* extras */}
        {dish.extras.length > 0 && (
          <section>
            <SectionLabel>Make it yours</SectionLabel>
            <div className="overflow-hidden rounded-2xl border border-line divide-y divide-line">
              {dish.extras.map((extra) => {
                const on = extras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => toggle(extras, setExtras, extra.id)}
                    className="flex w-full items-center gap-3 bg-white/[0.03] px-4 py-3.5 text-left cursor-pointer active:bg-white/[0.06] transition-colors"
                  >
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-lg border transition-colors duration-150",
                        on ? "border-fg bg-fg" : "border-line2 bg-transparent",
                      )}
                    >
                      <AnimatePresence>
                        {on && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 600, damping: 22 }}
                            className="flex"
                          >
                            <Check size={14} strokeWidth={3.5} className="text-black" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span className="flex-1 text-[14.5px] font-medium">{extra.name}</span>
                    <span className="text-[13.5px] font-bold text-mute tabular-nums">
                      +{money(extra.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* sauces */}
        {dish.sauces.length > 0 && (
          <section>
            <SectionLabel>Sauces</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {dish.sauces.map((sauce) => {
                const on = sauces.includes(sauce.id);
                return (
                  <motion.button
                    key={sauce.id}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    aria-pressed={on}
                    onClick={() => toggle(sauces, setSauces, sauce.id)}
                    className={cn(
                      "h-10 rounded-full px-4 text-[13px] font-semibold cursor-pointer border transition-colors duration-150",
                      on
                        ? "bg-fg text-black border-transparent"
                        : "bg-white/[0.05] text-mute border-line",
                    )}
                  >
                    {sauce.name}
                    <span className={cn("ml-1.5 tabular-nums", on ? "text-black/60" : "text-dim")}>
                      +{money(sauce.price)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>
        )}

        {/* note */}
        <section>
          <SectionLabel>Special requests</SectionLabel>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            maxLength={140}
            placeholder="e.g. no onions, sauce on the side…"
            className="w-full resize-none rounded-2xl border border-line bg-white/[0.04] px-4 py-3 text-[14.5px] font-medium placeholder:text-dim focus:outline-none focus:border-white/30 transition-colors"
          />
        </section>
      </div>

      {/* pinned CTA — lives in the sheet footer slot via portal-less trick:
          rendered here but sticky to sheet bottom */}
      <div className="sticky bottom-0 z-10 border-t border-line bg-card/95 backdrop-blur-xl px-5 pt-3 pb-safe">
        <div className="flex items-center gap-3 pb-2">
          <Stepper value={qty} onChange={setQty} />
          <Button
            size="lg"
            className="min-w-0 flex-1 overflow-hidden"
            onClick={addToCart}
            aria-label={`Add ${qty} to cart for ${money(total)}`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 460, damping: 26 }}
                  className="flex items-center gap-2"
                >
                  <Check size={19} strokeWidth={3} /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 460, damping: 26 }}
                  className="flex items-center gap-2"
                >
                  Add to cart
                  <span className="opacity-40">·</span>
                  <AnimatedMoney value={total} />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-dim">
      {children}
    </p>
  );
}

/* ── gallery ─────────────────────────────────────────────── */

function Gallery({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative shrink-0">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {dish.images.map((src, i) => (
            <div key={src + i} className="relative h-[290px] min-w-0 flex-[0_0_100%]">
              <Image
                src={src}
                alt={`${dish.name} — photo ${i + 1}`}
                fill
                sizes="430px"
                priority={i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />

      <DishBadges badges={dish.badges} className="absolute left-4 top-4" />
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-black/40 border border-white/15 backdrop-blur-xl cursor-pointer"
      >
        <X size={16} />
      </button>

      {dish.images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {dish.images.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: selected === i ? 18 : 6,
                opacity: selected === i ? 1 : 0.45,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="h-1.5 rounded-full bg-white"
            />
          ))}
        </div>
      )}
    </div>
  );
}
