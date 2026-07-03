"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  Apple,
  Banknote,
  Check,
  ChevronLeft,
  Clock,
  CreditCard,
  Loader2,
  MapPin,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RESTAURANT } from "@/data/menu";
import { computeTotals, useCart } from "@/store/cart";
import { MapPreview } from "@/components/checkout/map-preview";
import { TotalsBlock } from "@/components/cart/cart-sheet";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { useMounted } from "@/lib/hooks";
import { cn, haptic, money } from "@/lib/utils";

type Mode = "delivery" | "pickup";
type PaymentId = "apple" | "google" | "card" | "cash";

const schema = z.object({
  name: z.string().min(2, "Your name helps the courier find you"),
  phone: z
    .string()
    .regex(/^\+?[\d\s()-]{8,18}$/, "Enter a valid phone number"),
  address: z.string().optional(),
  apt: z.string().optional(),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const PAYMENTS: { id: PaymentId; label: string; sub: string; Icon: typeof Apple }[] = [
  { id: "apple", label: "Apple Pay", sub: "Instant", Icon: Apple },
  { id: "google", label: "Google Pay", sub: "Instant", Icon: Wallet },
  { id: "card", label: "Card", sub: "On delivery", Icon: CreditCard },
  { id: "cash", label: "Cash", sub: "On delivery", Icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useMounted();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const clearCart = useCart((s) => s.clear);

  const [mode, setMode] = useState<Mode>("delivery");
  const [payment, setPayment] = useState<PaymentId>("apple");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<{ orderNo: string; total: number } | null>(null);

  const totals = useMemo(
    () => computeTotals(lines, promo, mode),
    [lines, promo, mode],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { name: "", phone: "", address: "", apt: "", comment: "" },
  });

  const onSubmit = (data: FormValues) => {
    if (mode === "delivery" && !data.address?.trim()) {
      setError("address", { message: "We need a street address for delivery" });
      return;
    }
    setPlacing(true);
    haptic(20);
    setTimeout(() => {
      setPlaced({
        orderNo: `NR-${Math.floor(1000 + Math.random() * 9000)}`,
        total: totals.total,
      });
      clearCart();
    }, 1500);
  };

  const empty = mounted && lines.length === 0 && !placed;

  return (
    <main className="min-h-dvh pb-6">
      {/* header */}
      <div className="sticky top-0 z-30 border-b border-line bg-base/80 backdrop-blur-2xl pt-safe">
        <div className="relative flex h-14 items-center justify-center px-5">
          <motion.button
            whileTap={{ scale: 0.86 }}
            aria-label="Back to menu"
            onClick={() => router.back()}
            className="absolute left-4 grid size-10 place-items-center rounded-full border border-line bg-white/[0.06] cursor-pointer"
          >
            <ChevronLeft size={19} />
          </motion.button>
          <h1 className="text-[17px] font-extrabold tracking-tight">Checkout</h1>
        </div>
      </div>

      {empty ? (
        <div className="flex flex-col items-center gap-4 px-8 py-24 text-center">
          <span className="grid size-16 place-items-center rounded-full border border-line bg-white/[0.05]">
            <ShoppingBag size={26} className="text-dim" />
          </span>
          <p className="text-[16px] font-bold">Nothing to check out yet</p>
          <Button variant="glass" size="sm" onClick={() => router.push("/")}>
            Back to the menu
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 px-5 pt-5">
          {/* mode */}
          <Segmented<Mode>
            groupId="mode"
            value={mode}
            onChange={setMode}
            options={[
              { id: "delivery", label: "Delivery", hint: RESTAURANT.deliveryTime },
              { id: "pickup", label: "Pickup", hint: "15–20 min" },
            ]}
          />

          {/* destination */}
          <AnimatePresence mode="wait" initial={false}>
            {mode === "delivery" ? (
              <motion.section
                key="delivery"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="space-y-4"
              >
                <MapPreview />
                <Field
                  label="Street address"
                  error={errors.address?.message}
                  input={
                    <input
                      {...register("address")}
                      placeholder="e.g. 48 Marble Row"
                      autoComplete="street-address"
                      className={inputCls(!!errors.address)}
                    />
                  }
                />
                <Field
                  label="Apartment, floor, entrance (optional)"
                  input={
                    <input
                      {...register("apt")}
                      placeholder="Apt 12 · floor 3 · door code 4821"
                      className={inputCls(false)}
                    />
                  }
                />
              </motion.section>
            ) : (
              <motion.section
                key="pickup"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex items-center gap-3.5 rounded-3xl border border-line bg-white/[0.04] p-4"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-fg text-black">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="text-[15px] font-bold">{RESTAURANT.address}</p>
                  <p className="mt-0.5 text-[13px] font-medium text-mute">
                    Ready in 15–20 min · we&apos;ll text you when it&apos;s hot
                  </p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* contact */}
          <section className="space-y-4">
            <SectionTitle>Contact</SectionTitle>
            <Field
              label="Your name"
              error={errors.name?.message}
              input={
                <input
                  {...register("name")}
                  placeholder="Aivar"
                  autoComplete="name"
                  className={inputCls(!!errors.name)}
                />
              }
            />
            <Field
              label="Phone number"
              error={errors.phone?.message}
              input={
                <input
                  {...register("phone")}
                  placeholder="+1 415 000 0000"
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputCls(!!errors.phone)}
                />
              }
            />
          </section>

          {/* payment */}
          <section>
            <SectionTitle>Payment</SectionTitle>
            <div className="mt-3 grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Payment method">
              {PAYMENTS.map(({ id, label, sub, Icon }) => {
                const active = payment === id;
                return (
                  <motion.button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      haptic();
                      setPayment(id);
                    }}
                    className={cn(
                      "relative rounded-2xl border p-4 text-left transition-colors duration-150 cursor-pointer",
                      active
                        ? "border-white/60 bg-white/[0.09]"
                        : "border-line bg-white/[0.03]",
                    )}
                  >
                    <Icon size={20} className={active ? "text-fg" : "text-mute"} />
                    <p className="mt-2.5 text-[14px] font-bold">{label}</p>
                    <p className="text-[11.5px] font-medium text-dim">{sub}</p>
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 560, damping: 24 }}
                          className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-fg"
                        >
                          <Check size={12} strokeWidth={3.5} className="text-black" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* comment */}
          <Field
            label="Comment for the kitchen (optional)"
            input={
              <textarea
                {...register("comment")}
                rows={2}
                placeholder="Ring the bell twice, leave at the door…"
                className={cn(inputCls(false), "h-auto resize-none py-3")}
              />
            }
          />

          {/* summary */}
          <section className="rounded-3xl border border-line bg-white/[0.03] p-4">
            <SectionTitle>Order summary</SectionTitle>
            <div className="mt-3 mb-4 space-y-2.5">
              {lines.map((l) => (
                <div key={l.key} className="flex items-center gap-3">
                  <span className="relative size-10 shrink-0 overflow-hidden rounded-xl bg-card2">
                    <Image src={l.image} alt="" fill sizes="40px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">
                    {l.name}
                    <span className="ml-1.5 text-dim font-medium">×{l.qty}</span>
                  </span>
                  <span className="text-[13.5px] font-bold tabular-nums">
                    {money(l.unitPrice * l.qty)}
                  </span>
                </div>
              ))}
            </div>
            <TotalsBlock totals={totals} />
            <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-dim">
              <Clock size={13} />
              {mode === "delivery"
                ? `Estimated arrival: ${RESTAURANT.deliveryTime}`
                : "Ready for pickup in 15–20 min"}
            </p>
          </section>

          {/* CTA */}
          <div className="sticky bottom-0 -mx-5 bg-gradient-to-t from-base via-base/95 to-transparent px-5 pt-5 pb-safe">
            <Button size="lg" type="submit" disabled={placing} className="w-full">
              {placing ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Placing your order…
                </>
              ) : (
                <>Pay {money(totals.total)}</>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* success */}
      <AnimatePresence>
        {placed && (
          <SuccessOverlay
            orderNo={placed.orderNo}
            total={placed.total}
            mode={mode}
            onDone={() => router.push("/")}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ── success overlay ─────────────────────────────────────── */

function SuccessOverlay({
  orderNo,
  total,
  mode,
  onDone,
}: {
  orderNo: string;
  total: number;
  mode: Mode;
  onDone: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 mx-auto flex w-full max-w-[430px] flex-col items-center justify-center bg-base px-8 text-center"
      role="status"
    >
      <div className="relative mb-8">
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-white/25"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 2.2 + i * 0.5, opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.6, delay: 0.9 + i * 0.25, ease: "easeOut" }}
          />
        ))}
        <svg viewBox="0 0 120 120" className="size-28">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#ffffff1a" strokeWidth="3" />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#fafafa"
            strokeWidth="3.5"
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          <motion.path
            d="M38 62 L54 78 L84 46"
            fill="none"
            stroke="#fafafa"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.55, duration: 0.35, ease: "easeOut" }}
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 24 }}
      >
        <h2 className="text-[26px] font-extrabold tracking-tight">Order confirmed</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-mute">
          Order <span className="font-bold text-fg">{orderNo}</span> ·{" "}
          <span className="font-bold text-fg tabular-nums">{money(total)}</span>
          <br />
          {mode === "delivery"
            ? `Arriving in ${RESTAURANT.deliveryTime}. The kitchen is already on it.`
            : "Ready for pickup in 15–20 min. See you soon."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, type: "spring", stiffness: 260, damping: 24 }}
        className="mt-10 w-full"
      >
        <Button size="lg" className="w-full" onClick={onDone}>
          Back to the menu
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ── form bits ───────────────────────────────────────────── */

function inputCls(hasError: boolean) {
  return cn(
    "h-12 w-full rounded-2xl border bg-white/[0.04] px-4 text-[15px] font-medium placeholder:text-dim focus:outline-none transition-colors",
    hasError ? "border-danger/60" : "border-line focus:border-white/30",
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-dim">
      {children}
    </h3>
  );
}

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block px-1 text-[13px] font-semibold text-mute">
        {label}
      </span>
      {input}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            role="alert"
            className="block px-1 pt-1.5 text-[12.5px] font-medium text-danger"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
