"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { computeTotals, useCart } from "@/store/cart";
import { AnimatedMoney } from "@/components/ui/animated-money";
import { useMounted } from "@/lib/hooks";
import { haptic } from "@/lib/utils";

/** floating cart pill — glass shadow, live total, item thumbnails */
export function CartFab({ onOpen, hidden }: { onOpen: () => void; hidden?: boolean }) {
  const mounted = useMounted();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const totals = computeTotals(lines, promo);
  const show = mounted && !hidden && lines.length > 0;
  const thumbs = lines.slice(0, 3);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] px-5 pb-safe"
        >
          <motion.button
            type="button"
            onClick={() => {
              haptic();
              onOpen();
            }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Open cart, ${totals.count} items`}
            className="mb-2 flex h-[62px] w-full items-center gap-3 rounded-[26px] bg-fg px-4 text-black shadow-[0_18px_50px_-10px_rgba(255,255,255,0.28),0_10px_30px_-8px_rgba(0,0,0,0.7)] cursor-pointer"
          >
            <span className="flex -space-x-3">
              {thumbs.map((l) => (
                <span
                  key={l.key}
                  className="relative size-9 overflow-hidden rounded-full border-2 border-white shadow"
                >
                  <Image src={l.image} alt="" fill sizes="36px" className="object-cover" />
                </span>
              ))}
            </span>
            <span className="flex-1 text-left leading-tight">
              <span className="block text-[15px] font-extrabold tracking-tight">
                View cart
              </span>
              <motion.span
                key={totals.count}
                initial={{ scale: 1.3, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                className="inline-block text-[12px] font-semibold text-black/55"
              >
                {totals.count} {totals.count === 1 ? "item" : "items"}
              </motion.span>
            </span>
            <AnimatedMoney
              value={totals.subtotal}
              className="text-[17px] font-extrabold tracking-tight"
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
