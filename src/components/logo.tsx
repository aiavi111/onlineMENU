import { cn } from "@/lib/utils";

/**
 * Векторная версия фирменного знака «mubarak» — тонкие геометричные
 * штрихи в духе оригинального лого. Цвет наследуется через currentColor.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 588 128"
      role="img"
      aria-label="Mubarak"
      className={cn("block", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
    >
      {/* m */}
      <path d="M14 118 V56 q0 -24 21 -24 q21 0 21 24 v62 M56 56 q0 -24 21 -24 q21 0 21 24 v62" />
      {/* u */}
      <path d="M126 32 v56 q0 30 24 30 q24 0 24 -30 V32" />
      {/* b — нижняя петля */}
      <path d="M206 10 v76 q0 32 24 32 q24 0 24 -30 q0 -28 -24 -28 q-16 0 -24 12" />
      {/* a */}
      <path d="M330 88 q0 -26 -23 -26 q-23 0 -23 27 q0 29 23 29 q23 0 23 -30 z M330 118 V52 q0 -20 -16 -20" />
      {/* r */}
      <path d="M366 62 v56 M366 88 q0 -26 23 -26 q20 0 22 18 M394 84 l20 34" />
      {/* a */}
      <path d="M486 88 q0 -26 -23 -26 q-23 0 -23 27 q0 29 23 29 q23 0 23 -30 z M486 118 V52 q0 -20 -16 -20" />
      {/* k */}
      <path d="M522 10 v108 M566 62 l-40 32 M540 84 l28 34" />
    </svg>
  );
}
