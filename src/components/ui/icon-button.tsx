"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface IconButtonProps extends HTMLMotionProps<"button"> {
  label: string; // обязательный aria-label
  size?: "sm" | "md";
}

/** тёмная стеклянная круглая кнопка — для наложения поверх фото */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, size = "md", ...props }, ref) => (
    <motion.button
      ref={ref}
      aria-label={label}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full cursor-pointer",
        "bg-black/35 text-white border border-white/20 backdrop-blur-xl",
        size === "md" ? "size-11" : "size-9",
        className,
      )}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";
