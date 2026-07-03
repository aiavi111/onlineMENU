import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mubarak — Чайхана | Доставка в Бишкеке",
  description:
    "Чайхана Mubarak: плов, лагман, манты и шашлык с доставкой за 30–40 минут. Восточная кухня, завтраки, обеды и ужины. Бишкек, пр. Чуй, 104.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mubarak",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf8f4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-sans bg-shell">
        <Providers>
          {/* мобильная сцена: во всю ширину на телефоне, рамка на десктопе */}
          {/* телефон: колонка 430px; ноутбук (≥1024px): во весь экран */}
          <div className="relative mx-auto w-full max-w-[430px] lg:max-w-none min-h-dvh bg-base sm:ring-1 sm:ring-line sm:shadow-[0_0_80px_-20px_rgba(30,25,15,0.25)] lg:ring-0 lg:shadow-none">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
