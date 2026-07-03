"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { ArrowRight, ShoppingBag, Ticket, Trash2, X } from "lucide-react";
import type { CartLine } from "@/types";
import { computeTotals, PROMOS, useCart } from "@/store/cart";
import { RESTAURANT } from "@/data/menu";
import { AnimatedMoney } from "@/components/ui/animated-money";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { cn, haptic, money } from "@/lib/utils";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const clear = useCart((s) => s.clear);
  const totals = computeTotals(lines, promo);
  const belowMin = totals.subtotal > 0 && totals.subtotal < RESTAURANT.minOrder;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      maxHeight="90dvh"
      header={
        <div className="flex items-center justify-between px-6 pb-3">
          <h2 className="text-xl font-extrabold tracking-tight">
            Your cart
            {totals.count > 0 && (
              <span className="ml-2 text-[13px] font-semibold text-dim tabular-nums">
                {totals.count} {totals.count === 1 ? "item" : "items"}
              </span>
            )}
          </h2>
          {lines.length > 0 && (
            <button
              onClick={() => {
                haptic();
                clear();
              }}
              className="text-[13px] font-semibold text-dim active:text-fg cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      }
      footer={
        lines.length > 0 ? (
          <div className="pb-2">
            <TotalsBlock totals={totals} />
            <Button
              size="lg"
              className="mt-3 w-full"
              disabled={belowMin}
              onClick={() => {
                onClose();
                router.push("/checkout");
              }}
            >
              {belowMin ? (
                `Minimum order ${money(RESTAURANT.minOrder)}`
              ) : (
                <>
                  Go to checkout
                  <ArrowRight size={18} strokeWidth={2.6} />
                </>
              )}
            </Button>
          </div>
        ) : undefined
      }
    >
      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-full border border-line bg-white/[0.05]">
            <ShoppingBag size={26} className="text-dim" />
          </span>
          <div>
            <p className="text-[16px] font-bold">Your cart is empty</p>
            <p className="mt-1 text-[13.5px] text-mute">
              Beautiful things belong in here.
            </p>
          </div>
          <Button variant="glass" size="sm" onClick={onClose}>
            Browse the menu
          </Button>
        </div>
      ) : (
        <div className="px-5 pb-6">
          <p className="px-1 pb-3 text-[12px] font-medium text-dim">
            Swipe a dish left to remove it
          </p>
          <div>
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <CartLineRow key={line.key} line={line} />
              ))}
            </AnimatePresence>
          </div>
          <PromoField activePromo={promo} />
        </div>
      )}
    </BottomSheet>
  );
}

/* ── swipeable line ──────────────────────────────────────── */

function CartLineRow({ line }: { line: CartLine }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0, x: -60 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="relative overflow-hidden"
    >
      {/* delete zone behind */}
      <div className="absolute inset-y-2 right-0 flex w-[84px] items-center justify-center">
        <motion.button
          whileTap={{ scale: 0.85 }}
          aria-label={`Remove ${line.name}`}
          onClick={() => {
            haptic(16);
            remove(line.key);
          }}
          className="grid size-11 place-items-center rounded-full border border-danger/35 bg-danger/15 text-danger cursor-pointer"
        >
          <Trash2 size={18} />
        </motion.button>
      </div>

      {/* draggable face */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -92, right: 0 }}
        dragElastic={0.08}
        animate={{ x: revealed ? -92 : 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -160 || info.velocity.x < -800) {
            haptic(16);
            remove(line.key);
          } else {
            setRevealed(info.offset.x < -46);
          }
        }}
        className="relative mb-3 flex items-center gap-3 rounded-3xl border border-line bg-white/[0.04] p-3"
      >
        <span className="relative size-[58px] shrink-0 overflow-hidden rounded-2xl bg-card2">
          <Image src={line.image} alt="" fill sizes="58px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-bold leading-tight">{line.name}</p>
          {(line.sizeLabel || line.addOns.length > 0) && (
            <p className="mt-0.5 truncate text-[12px] font-medium text-dim">
              {[line.sizeLabel, ...line.addOns].filter(Boolean).join(" · ")}
            </p>
          )}
          <p className="mt-1 text-[14px] font-extrabold tabular-nums">
            {money(line.unitPrice * line.qty)}
          </p>
        </div>
        <Stepper
          size="sm"
          min={0}
          value={line.qty}
          onChange={(v) => setQty(line.key, v)}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── promo code ──────────────────────────────────────────── */

function PromoField({ activePromo }: { activePromo: string | null }) {
  const applyPromo = useCart((s) => s.applyPromo);
  const clearPromo = useCart((s) => s.clearPromo);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const controls = useAnimationControls();

  const submit = () => {
    if (!code.trim()) return;
    if (applyPromo(code)) {
      haptic(12);
      setCode("");
      setError(false);
    } else {
      setError(true);
      controls.start({ x: [0, -9, 9, -6, 6, 0] }, { duration: 0.4 });
    }
  };

  if (activePromo) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-2 flex items-center justify-between rounded-2xl border border-line2 bg-white/[0.07] px-4 py-3"
      >
        <span className="flex items-center gap-2 text-[14px] font-bold">
          <Ticket size={16} className="text-mute" />
          {activePromo}
          <span className="rounded-full bg-fg px-2 py-0.5 text-[11px] font-extrabold text-black">
            −{Math.round((PROMOS[activePromo] ?? 0) * 100)}%
          </span>
        </span>
        <button
          aria-label="Remove promo code"
          onClick={clearPromo}
          className="grid size-7 place-items-center rounded-full bg-white/10 cursor-pointer"
        >
          <X size={13} />
        </button>
      </motion.div>
    );
  }

  return (
    <div className="mt-2">
      <motion.div
        animate={controls}
        className={cn(
          "flex items-center gap-2 rounded-2xl border bg-white/[0.04] p-1.5 pl-4 transition-colors",
          error ? "border-danger/50" : "border-line",
        )}
      >
        <Ticket size={16} className="shrink-0 text-dim" />
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Promo code — try NOIR10"
          aria-label="Promo code"
          aria-invalid={error}
          className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold uppercase tracking-wide placeholder:normal-case placeholder:font-medium placeholder:text-dim focus:outline-none"
        />
        <Button size="sm" variant="glass" onClick={submit} className="shrink-0">
          Apply
        </Button>
      </motion.div>
      {error && (
        <p role="alert" className="mt-1.5 px-2 text-[12px] font-medium text-danger">
          That code didn&apos;t work — try NOIR10.
        </p>
      )}
    </div>
  );
}

/* ── totals ──────────────────────────────────────────────── */

export function TotalsBlock({
  totals,
  className,
}: {
  totals: ReturnType<typeof computeTotals>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Row label="Subtotal">
        <AnimatedMoney value={totals.subtotal} className="font-semibold" />
      </Row>
      {totals.discount > 0 && (
        <Row label="Discount">
          <span className="font-semibold text-leaf tabular-nums">
            −{money(totals.discount)}
          </span>
        </Row>
      )}
      <Row label="Delivery">
        {totals.freeDelivery ? (
          <span className="font-semibold">
            <span className="mr-1.5 text-dim line-through">
              {money(RESTAURANT.deliveryFee)}
            </span>
            Free
          </span>
        ) : (
          <AnimatedMoney value={totals.deliveryFee} className="font-semibold" />
        )}
      </Row>
      <Row label="Taxes & fees">
        <AnimatedMoney value={totals.tax} className="font-semibold" />
      </Row>
      <div className="my-2 border-t border-dashed border-line2" />
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-extrabold">Total</span>
        <AnimatedMoney
          value={totals.total}
          className="text-[20px] font-extrabold tracking-tight"
        />
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between text-[13.5px]">
      <span className="font-medium text-mute">{label}</span>
      {children}
    </div>
  );
}
