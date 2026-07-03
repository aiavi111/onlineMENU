"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { BadgeCheck, ChevronDown, Clock, MapPin, Share, Star } from "lucide-react";
import { RESTAURANT } from "@/data/menu";
import { useFavorites } from "@/store/favorites";
import { FavHeart } from "@/components/fav-heart";
import { IconButton } from "@/components/ui/icon-button";
import { Logo } from "@/components/logo";
import { money, plural } from "@/lib/utils";

const spring = { type: "spring", stiffness: 220, damping: 26 } as const;

export function Hero() {
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 460], [0, 140]);
  const favActive = useFavorites((s) => s.ids.includes("__restaurant__"));
  const toggleFav = useFavorites((s) => s.toggle);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = {
      title: "Mubarak — Чайхана",
      url: "https://online-menu-kap3.vercel.app",
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }
    } catch {
      /* закрыли шэринг */
    }
  };

  return (
    <header className="relative">
      {/* ── фото с параллаксом ── */}
      <div className="relative h-[440px] overflow-hidden">
        <motion.div style={{ y: parallax }} className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.14, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={RESTAURANT.heroImage}
              alt="Зал чайханы Mubarak"
              fill
              priority
              sizes="430px"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
        {/* кинематографичные градиенты */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-base via-base/70 to-transparent" />

        {/* верхние кнопки */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.15 }}
          className="absolute inset-x-0 top-0 pt-safe px-5 lg:px-10 flex items-center justify-between"
        >
          <button
            className="flex items-center gap-1.5 rounded-full bg-black/35 border border-white/20 backdrop-blur-xl px-3.5 h-11 text-[13px] font-semibold text-white cursor-pointer"
            aria-label="Изменить адрес доставки"
          >
            <MapPin size={14} className="text-white/70" />
            Доставка · <span>Дом</span>
            <ChevronDown size={14} className="text-white/70" />
          </button>
          <div className="flex items-center gap-2.5">
            <IconButton
              label={copied ? "Ссылка скопирована" : "Поделиться"}
              onClick={share}
            >
              {copied ? <BadgeCheck size={18} /> : <Share size={17} />}
            </IconButton>
            <FavHeart
              active={favActive}
              onToggle={() => toggleFav("__restaurant__")}
            />
          </div>
        </motion.div>

        {/* имя ресторана */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-5 lg:px-10 text-white">
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...spring, delay: 0.25 }}
          >
            <Logo className="h-11 lg:h-14 w-auto text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]" />
            <p className="mt-2.5 text-[15px] font-medium text-white/85">
              {RESTAURANT.tagline}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...spring, delay: 0.34 }}
            className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] font-medium text-white/80"
          >
            <span className="flex items-center gap-1 font-bold text-white">
              <Star size={14} className="fill-star text-star" />
              {RESTAURANT.rating}
            </span>
            <span>
              ({RESTAURANT.reviews.toLocaleString("ru-RU")}{" "}
              {plural(RESTAURANT.reviews, ["оценка", "оценки", "оценок"])})
            </span>
            <span className="text-white/50">·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {RESTAURANT.deliveryTime}
            </span>
            <span className="text-white/50">·</span>
            <span>{RESTAURANT.distance}</span>
          </motion.div>
        </div>
      </div>

      {/* ── карточка условий ── */}
      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.42 }}
        className="relative z-10 mx-5 -mt-1 rounded-3xl border border-line bg-white/85 backdrop-blur-2xl p-4 shadow-lift lg:mx-auto lg:-mt-14 lg:max-w-[760px]"
      >
        <div className="grid grid-cols-3 divide-x divide-line text-center">
          <div className="px-2">
            <p className="text-[15px] font-bold tabular-nums">
              {money(RESTAURANT.deliveryFee)}
            </p>
            <p className="mt-0.5 text-[11px] text-dim font-medium leading-tight">
              Доставка · 0 с от {money(RESTAURANT.freeDeliveryOver)}
            </p>
          </div>
          <div className="px-2">
            <p className="text-[15px] font-bold tabular-nums">
              {money(RESTAURANT.minOrder)}
            </p>
            <p className="mt-0.5 text-[11px] text-dim font-medium">Мин. заказ</p>
          </div>
          <div className="px-2">
            <p className="flex items-center justify-center gap-1.5 text-[15px] font-bold">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf/50" />
                <span className="relative inline-flex size-2 rounded-full bg-leaf" />
              </span>
              Открыто
            </p>
            <p className="mt-0.5 text-[11px] text-dim font-medium tabular-nums">
              {RESTAURANT.hours}
            </p>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
