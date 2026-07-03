"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { computeTotals, useCart } from "@/store/cart";
import { AnimatedMoney } from "@/components/ui/animated-money";
import { useMounted } from "@/lib/hooks";
import { haptic, plural } from "@/lib/utils";

/** плавающая корзина: живой итог и миниатюры блюд */
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
          className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] px-5 pb-safe lg:inset-x-auto lg:right-8 lg:mx-0 lg:w-[400px] lg:px-0"
        >
          <motion.button
            type="button"
            onClick={() => {
              haptic();
              onOpen();
            }}
            whileTap={{ scale: 0.97 }}
            aria-label={`Открыть корзину, ${totals.count} ${plural(totals.count, ["позиция", "позиции", "позиций"])}`}
            className="mb-2 flex h-[62px] w-full items-center gap-3 rounded-[26px] bg-fg px-4 text-onfg shadow-[0_18px_44px_-10px_rgba(30,25,15,0.5)] cursor-pointer"
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
                Корзина
              </span>
              <motion.span
                key={totals.count}
                initial={{ scale: 1.3, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                className="inline-block text-[12px] font-semibold text-onfg/60"
              >
                {totals.count} {plural(totals.count, ["позиция", "позиции", "позиций"])}
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
