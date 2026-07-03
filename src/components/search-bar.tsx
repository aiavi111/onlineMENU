"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Search, SlidersHorizontal, X } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { cn, haptic } from "@/lib/utils";

export type SortId = "recommended" | "price" | "rating";

interface SearchBarProps {
  query: string;
  onQuery: (q: string) => void;
  vegOnly: boolean;
  onVegOnly: (v: boolean) => void;
  sort: SortId;
  onSort: (s: SortId) => void;
}

export function SearchBar({
  query,
  onQuery,
  vegOnly,
  onVegOnly,
  sort,
  onSort,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersActive = vegOnly || sort !== "recommended";

  useEffect(() => {
    if (!listening) return;
    const t = setTimeout(() => setListening(false), 2000);
    return () => clearTimeout(t);
  }, [listening]);

  return (
    <div className="mx-5 mt-5 flex items-center gap-2.5">
      <motion.div
        animate={{
          scale: focused ? 1.015 : 1,
          borderColor: focused ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="flex h-[52px] flex-1 items-center gap-2.5 rounded-full border bg-white/[0.06] px-4 backdrop-blur-xl shadow-float"
      >
        <Search size={18} className="shrink-0 text-dim" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type="search"
          enterKeyHint="search"
          aria-label="Search the menu"
          placeholder="Craving something tonight?"
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium placeholder:text-dim focus:outline-none"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              aria-label="Clear search"
              onClick={() => onQuery("")}
              className="grid size-6 shrink-0 place-items-center rounded-full bg-white/15 cursor-pointer"
            >
              <X size={13} />
            </motion.button>
          )}
        </AnimatePresence>
        <button
          type="button"
          aria-label="Voice search"
          onClick={() => {
            haptic();
            setListening(true);
          }}
          className="relative grid size-8 shrink-0 place-items-center cursor-pointer text-mute"
        >
          <AnimatePresence>
            {listening && (
              <>
                <motion.span
                  key="pulse"
                  className="absolute inset-0 rounded-full bg-white/20"
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.span
                  key="pulse2"
                  className="absolute inset-1 rounded-full bg-white/10"
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </>
            )}
          </AnimatePresence>
          <Mic size={17} className={cn("relative", listening && "text-fg")} />
        </button>
      </motion.div>

      {/* filters */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        aria-label="Filters"
        onClick={() => setFiltersOpen(true)}
        className={cn(
          "relative grid size-[52px] shrink-0 place-items-center rounded-full border cursor-pointer shadow-float transition-colors",
          filtersActive
            ? "bg-fg text-black border-transparent"
            : "bg-white/[0.06] border-line2 text-fg backdrop-blur-xl",
        )}
      >
        <SlidersHorizontal size={19} />
        {filtersActive && (
          <span className="absolute right-3 top-3 size-2 rounded-full bg-black" />
        )}
      </motion.button>

      <BottomSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        header={
          <div className="px-6 pb-4">
            <h2 className="text-xl font-extrabold tracking-tight">Filters</h2>
          </div>
        }
      >
        <div className="px-6 pb-safe space-y-6 pb-8">
          {/* veg switch */}
          <button
            type="button"
            role="switch"
            aria-checked={vegOnly}
            onClick={() => {
              haptic();
              onVegOnly(!vegOnly);
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-white/[0.04] p-4 cursor-pointer"
          >
            <span className="text-left">
              <span className="block text-[15px] font-semibold">
                Vegetarian only
              </span>
              <span className="block text-[13px] text-dim">
                Hide dishes with meat & fish
              </span>
            </span>
            <span
              className={cn(
                "flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-200",
                vegOnly ? "justify-end bg-fg" : "justify-start bg-white/15",
              )}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={cn(
                  "size-5 rounded-full",
                  vegOnly ? "bg-black" : "bg-white",
                )}
              />
            </span>
          </button>

          <div>
            <p className="mb-2.5 text-[13px] font-semibold uppercase tracking-widest text-dim">
              Sort by
            </p>
            <Segmented<SortId>
              groupId="sort"
              value={sort}
              onChange={onSort}
              options={[
                { id: "recommended", label: "For you" },
                { id: "rating", label: "Top rated" },
                { id: "price", label: "Price" },
              ]}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="glass"
              className="flex-1"
              onClick={() => {
                onVegOnly(false);
                onSort("recommended");
              }}
            >
              Reset
            </Button>
            <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
              Show dishes
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
