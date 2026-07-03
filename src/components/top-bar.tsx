"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { RESTAURANT } from "@/data/menu";

/** compact restaurant row that unfolds inside the sticky rail once the hero scrolls away */
export function MiniBar({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 36 }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 h-12">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-lg bg-fg text-black text-[13px] font-black">
                N
              </span>
              <span className="text-[15px] font-extrabold tracking-tight">NOIR</span>
            </div>
            <span className="flex items-center gap-1 text-[13px] font-bold">
              <Star size={13} className="fill-star text-star" />
              {RESTAURANT.rating}
              <span className="text-dim font-medium">
                · {RESTAURANT.deliveryTime}
              </span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
