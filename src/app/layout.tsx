import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NOIR — Modern Kitchen & Bar",
  description:
    "Premium food ordering from NOIR. Chef-crafted burgers, sushi, grill and more — delivered in 25–35 min.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NOIR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-shell">
        <Providers>
          {/* phone-width stage: full-bleed on mobile, framed on desktop */}
          <div className="relative mx-auto w-full max-w-[430px] min-h-dvh bg-base sm:ring-1 sm:ring-line sm:shadow-[0_0_120px_-20px_rgba(255,255,255,0.07)]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
