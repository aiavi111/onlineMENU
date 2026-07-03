"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { RESTAURANT } from "@/data/menu";
import { Logo } from "@/components/logo";

/** компактная плашка ресторана, раскрывается в прилипшей панели категорий */
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
            <Logo className="h-[18px] w-auto text-fg" />
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
