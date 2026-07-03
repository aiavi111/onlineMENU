"use client";

import { motion } from "framer-motion";
import { cn, haptic } from "@/lib/utils";

interface SegmentedProps<T extends string> {
  groupId: string; // unique layoutId namespace
  options: { id: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}

/** iOS-style segmented control with a sliding white thumb */
export function Segmented<T extends string>({
  groupId,
  options,
  value,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex rounded-full bg-white/[0.06] border border-line p-1",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => {
              haptic();
              onChange(opt.id);
            }}
            className="relative flex-1 h-10 rounded-full text-sm font-semibold cursor-pointer"
          >
            {active && (
              <motion.span
                layoutId={`seg-${groupId}`}
                className="absolute inset-0 rounded-full bg-fg shadow-lift"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex flex-col items-center justify-center leading-tight transition-colors duration-200",
                active ? "text-black" : "text-mute",
              )}
            >
              {opt.label}
              {opt.hint && (
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    active ? "text-black/60" : "text-dim",
                  )}
                >
                  {opt.hint}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
