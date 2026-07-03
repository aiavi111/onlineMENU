"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/types";
import { RESTAURANT } from "@/data/menu";

export const TAX_RATE = 0.08;
export const PROMOS: Record<string, number> = { NOIR10: 0.1, CHEF20: 0.2 };

interface CartState {
  lines: CartLine[];
  promo: string | null;
  add: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      promo: null,

      add: (line) =>
        set((s) => {
          const qty = line.qty ?? 1;
          const existing = s.lines.find((l) => l.key === line.key);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.key === line.key ? { ...l, qty: l.qty + qty } : l,
              ),
            };
          }
          return { lines: [...s.lines, { ...line, qty }] };
        }),

      remove: (key) =>
        set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),

      setQty: (key, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.key !== key)
              : s.lines.map((l) => (l.key === key ? { ...l, qty } : l)),
        })),

      applyPromo: (code) => {
        const c = code.trim().toUpperCase();
        if (PROMOS[c]) {
          set({ promo: c });
          return true;
        }
        return false;
      },

      clearPromo: () => set({ promo: null }),
      clear: () => set({ lines: [], promo: null }),
    }),
    { name: "noir-cart" },
  ),
);

/* ── derived totals ──────────────────────────────────────── */
export interface Totals {
  count: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  freeDelivery: boolean;
}

export function computeTotals(
  lines: CartLine[],
  promo: string | null,
  mode: "delivery" | "pickup" = "delivery",
): Totals {
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
  const discount = promo ? subtotal * (PROMOS[promo] ?? 0) : 0;
  const freeDelivery = subtotal - discount >= RESTAURANT.freeDeliveryOver;
  const deliveryFee =
    mode === "pickup" || count === 0 || freeDelivery
      ? 0
      : RESTAURANT.deliveryFee;
  const tax = Math.max(0, (subtotal - discount) * TAX_RATE);
  const total = Math.max(0, subtotal - discount + deliveryFee + tax);
  return { count, subtotal, discount, deliveryFee, tax, total, freeDelivery };
}
