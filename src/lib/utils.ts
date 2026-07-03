import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** цены в кыргызских сомах — целые, с тонким пробелом: «1 250 с» */
export function money(n: number) {
  return `${Math.round(n).toLocaleString("ru-RU")} с`;
}

/** русская плюрализация: plural(3, ["блюдо", "блюда", "блюд"]) → «блюда» */
export function plural(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (d > 1 && d < 5) return forms[1];
  if (d === 1) return forms[0];
  return forms[2];
}

/** light haptic tick where supported */
export function haptic(ms = 8) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      /* noop */
    }
  }
}
