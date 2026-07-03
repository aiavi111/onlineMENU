"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { cn, haptic } from "@/lib/utils";

interface FavHeartProps {
  active: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
  className?: string;
}

/** избранное: пружинный «поп» + расходящееся кольцо */
export function FavHeart({ active, onToggle, size = "md", className }: FavHeartProps) {
  return (
    <IconButton
      label={active ? "Убрать из избранного" : "В избранное"}
      aria-pressed={active}
      size={size}
      className={cn("relative", className)}
      onClick={(e) => {
        e.stopPropagation();
        haptic();
        onToggle();
      }}
    >
      <AnimatePresence>
        {active && (
          <motion.span
            key="burst"
            className="absolute inset-0 rounded-full border-2 border-white/70"
            initial={{ opacity: 0.9, scale: 0.7 }}
            animate={{ opacity: 0, scale: 1.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <motion.span
        key={active ? "on" : "off"}
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 560, damping: 16 }}
        className="flex"
      >
        <Heart
          size={size === "md" ? 18 : 15}
          strokeWidth={2.2}
          className={active ? "fill-white text-white" : "text-white"}
        />
      </motion.span>
    </IconButton>
  );
}
