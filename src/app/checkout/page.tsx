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
  name: z.string().min(2, "Имя поможет курьеру найти вас"),
  phone: z
    .string()
    .regex(/^\+?[\d\s()-]{8,18}$/, "Укажите корректный номер телефона"),
  address: z.string().optional(),
  apt: z.string().optional(),
  comment: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const PAYMENTS: { id: PaymentId; label: string; sub: string; Icon: typeof Apple }[] = [
  { id: "apple", label: "Apple Pay", sub: "Мгновенно", Icon: Apple },
  { id: "google", label: "Google Pay", sub: "Мгновенно", Icon: Wallet },
  { id: "card", label: "Картой", sub: "Курьеру", Icon: CreditCard },
  { id: "cash", label: "Наличными", sub: "Курьеру", Icon: Banknote },
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
      setError("address", { message: "Для доставки нужен адрес" });
      return;
    }
    setPlacing(true);
    haptic(20);
    setTimeout(() => {
      setPlaced({
        orderNo: `MB-${Math.floor(1000 + Math.random() * 9000)}`,
        total: totals.total,
      });
      clearCart();
    }, 1500);
  };

  const empty = mounted && lines.length === 0 && !placed;

  return (
    <main className="min-h-dvh pb-6">
      {/* шапка */}
      <div className="sticky top-0 z-30 border-b border-line bg-base/85 backdrop-blur-2xl pt-safe">
        <div className="relative mx-auto flex h-14 max-w-[640px] items-center justify-center px-5">
          <motion.button
            whileTap={{ scale: 0.86 }}
            aria-label="Назад в меню"
            onClick={() => router.back()}
            className="absolute left-4 grid size-10 place-items-center rounded-full border border-line bg-white cursor-pointer"
          >
            <ChevronLeft size={19} />
          </motion.button>
          <h1 className="text-[17px] font-extrabold tracking-tight">Оформление</h1>
        </div>
      </div>

      {empty ? (
        <div className="flex flex-col items-center gap-4 px-8 py-24 text-center">
          <span className="grid size-16 place-items-center rounded-full border border-line bg-veil">
            <ShoppingBag size={26} className="text-dim" />
          </span>
          <p className="text-[16px] font-bold">Пока нечего оформлять</p>
          <Button variant="glass" size="sm" onClick={() => router.push("/")}>
            Вернуться в меню
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-[640px] space-y-7 px-5 pt-5"
        >
          {/* способ получения */}
          <Segmented<Mode>
            groupId="mode"
            value={mode}
            onChange={setMode}
            options={[
              { id: "delivery", label: "Доставка", hint: RESTAURANT.deliveryTime },
              { id: "pickup", label: "Самовывоз", hint: "15–20 мин" },
            ]}
          />

          {/* куда */}
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
                  label="Адрес доставки"
                  error={errors.address?.message}
                  input={
                    <input
                      {...register("address")}
                      placeholder="например, ул. Киевская, 95"
                      autoComplete="street-address"
                      className={inputCls(!!errors.address)}
                    />
                  }
                />
                <Field
                  label="Квартира, этаж, подъезд (необязательно)"
                  input={
                    <input
                      {...register("apt")}
                      placeholder="кв. 12 · 3 этаж · домофон 4821"
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
                className="flex items-center gap-3.5 rounded-3xl border border-line bg-card p-4 shadow-[0_4px_14px_-8px_rgba(30,25,15,0.14)]"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-fg text-onfg">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="text-[15px] font-bold">{RESTAURANT.address}</p>
                  <p className="mt-0.5 text-[13px] font-medium text-mute">
                    Готовим за 15–20 минут · напишем, когда будет готово
                  </p>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* контакты */}
          <section className="space-y-4">
            <SectionTitle>Контакты</SectionTitle>
            <Field
              label="Ваше имя"
              error={errors.name?.message}
              input={
                <input
                  {...register("name")}
                  placeholder="Айвар"
                  autoComplete="name"
                  className={inputCls(!!errors.name)}
                />
              }
            />
            <Field
              label="Номер телефона"
              error={errors.phone?.message}
              input={
                <input
                  {...register("phone")}
                  placeholder="+996 555 123 456"
                  inputMode="tel"
                  autoComplete="tel"
                  className={inputCls(!!errors.phone)}
                />
              }
            />
          </section>

          {/* оплата */}
          <section>
            <SectionTitle>Оплата</SectionTitle>
            <div
              className="mt-3 grid grid-cols-2 gap-2.5"
              role="radiogroup"
              aria-label="Способ оплаты"
            >
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
                        ? "border-fg/50 bg-veil2"
                        : "border-line bg-white",
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
                          <Check size={12} strokeWidth={3.5} className="text-onfg" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* комментарий */}
          <Field
            label="Комментарий к заказу (необязательно)"
            input={
              <textarea
                {...register("comment")}
                rows={2}
                placeholder="Позвоните за 5 минут, не звоните в дверь…"
                className={cn(inputCls(false), "h-auto resize-none py-3")}
              />
            }
          />

          {/* заказ */}
          <section className="rounded-3xl border border-line bg-card p-4 shadow-[0_4px_14px_-8px_rgba(30,25,15,0.14)]">
            <SectionTitle>Ваш заказ</SectionTitle>
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
                ? `Привезём через ${RESTAURANT.deliveryTime}`
                : "Будет готово через 15–20 мин"}
            </p>
          </section>

          {/* кнопка оплаты */}
          <div className="sticky bottom-0 -mx-5 bg-gradient-to-t from-base via-base/95 to-transparent px-5 pt-5 pb-safe">
            <Button size="lg" type="submit" disabled={placing} className="w-full">
              {placing ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Оформляем заказ…
                </>
              ) : (
                <>Оплатить {money(totals.total)}</>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* подтверждение */}
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

/* ── экран подтверждения ─────────────────────────────────── */

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base px-8 text-center"
      role="status"
    >
      <div className="relative mb-8">
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-fg/25"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 2.2 + i * 0.5, opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.6, delay: 0.9 + i * 0.25, ease: "easeOut" }}
          />
        ))}
        <svg viewBox="0 0 120 120" className="size-28">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#17150f1a" strokeWidth="3" />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#17150f"
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
            stroke="#17150f"
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
        <h2 className="text-[26px] font-extrabold tracking-tight">Заказ принят!</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-mute">
          Заказ <span className="font-bold text-fg">{orderNo}</span> ·{" "}
          <span className="font-bold text-fg tabular-nums">{money(total)}</span>
          <br />
          {mode === "delivery"
            ? `Кухня уже готовит. Курьер будет через ${RESTAURANT.deliveryTime}.`
            : `Будет готов через 15–20 минут. Ждём вас: ${RESTAURANT.address}.`}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, type: "spring", stiffness: 260, damping: 24 }}
        className="mt-10 w-full max-w-[430px]"
      >
        <Button size="lg" className="w-full" onClick={onDone}>
          Вернуться в меню
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ── детали формы ────────────────────────────────────────── */

function inputCls(hasError: boolean) {
  return cn(
    "h-12 w-full rounded-2xl border bg-white px-4 text-[15px] font-medium placeholder:text-dim focus:outline-none transition-colors",
    hasError ? "border-danger/60" : "border-line focus:border-fg/40",
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
