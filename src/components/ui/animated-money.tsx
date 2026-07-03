"use client";

import { useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn, money } from "@/lib/utils";

/** currency value that springs between amounts instead of snapping */
export function AnimatedMoney({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const spring = useSpring(value, { damping: 26, stiffness: 240 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const display = useTransform(spring, (v) => money(v));

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}
