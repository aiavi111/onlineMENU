"use client";

import { useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  type PanInfo,
} from "framer-motion";
import { useLockBody } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** rendered inside the draggable grab area, above the scroll body */
  header?: React.ReactNode;
  /** pinned below the scroll body (CTA rows), safe-area padded */
  footer?: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

/**
 * Premium iOS-style bottom sheet: spring entrance, drag-to-dismiss from
 * the grab handle, blurred scrim, safe-area aware.
 */
export function BottomSheet({
  open,
  onClose,
  children,
  header,
  footer,
  className,
  maxHeight = "92dvh",
}: BottomSheetProps) {
  const controls = useDragControls();
  useLockBody(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 600) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] sm:max-w-[480px]",
              "flex flex-col rounded-t-[28px] bg-card border-t border-x border-line",
              "shadow-[0_-24px_70px_-16px_rgba(30,25,15,0.35)]",
              className,
            )}
            style={{ maxHeight }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragListener={false}
            dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.02, bottom: 0.85 }}
            onDragEnd={handleDragEnd}
          >
            {/* grab area — drag starts here so body scroll stays free */}
            <div
              className="shrink-0 touch-none cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => controls.start(e)}
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="h-1.5 w-11 rounded-full bg-fg/15" />
              </div>
              {header}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
            {footer && (
              <div className="shrink-0 border-t border-line bg-card px-5 pt-3 pb-safe">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
