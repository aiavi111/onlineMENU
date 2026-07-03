"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn, haptic } from "@/lib/utils";

interface StepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function Stepper({
  value,
  onChange,
  min = 1,
  max = 20,
  size = "md",
  className,
}: StepperProps) {
  const btn =
    "flex items-center justify-center rounded-full cursor-pointer text-fg disabled:opacity-30 disabled:pointer-events-none";
  const dims = size === "md" ? "size-11" : "size-9";
  const icon = size === "md" ? 18 : 15;

  const step = (d: number) => {
    haptic();
    onChange(Math.min(max, Math.max(min - 1, value + d)));
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-veil border border-line",
        className,
      )}
    >
      <motion.button
        type="button"
        aria-label="Уменьшить количество"
        whileTap={{ scale: 0.8 }}
        className={cn(btn, dims)}
        disabled={value <= min}
        onClick={() => step(-1)}
      >
        <Minus size={icon} strokeWidth={2.5} />
      </motion.button>

      <span
        className={cn(
          "relative overflow-hidden text-center font-bold tabular-nums",
          size === "md" ? "w-8 text-base" : "w-6 text-sm",
        )}
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 480, damping: 32 }}
            className="inline-block"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>

      <motion.button
        type="button"
        aria-label="Увеличить количество"
        whileTap={{ scale: 0.8 }}
        className={cn(btn, dims)}
        disabled={value >= max}
        onClick={() => step(1)}
      >
        <Plus size={icon} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}
