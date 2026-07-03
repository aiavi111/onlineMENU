"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { BadgeCheck, ChevronDown, Clock, MapPin, Share, Star } from "lucide-react";
import { RESTAURANT } from "@/data/menu";
import { useFavorites } from "@/store/favorites";
import { FavHeart } from "@/components/fav-heart";
import { IconButton } from "@/components/ui/icon-button";
import { money } from "@/lib/utils";

const spring = { type: "spring", stiffness: 220, damping: 26 } as const;

export function Hero() {
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 460], [0, 140]);
  const favActive = useFavorites((s) => s.ids.includes("__restaurant__"));
  const toggleFav = useFavorites((s) => s.toggle);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = { title: "NOIR — Modern Kitchen & Bar", url: "https://noir.example" };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }
    } catch {
      /* dismissed */
    }
  };

  return (
    <header className="relative">
      {/* ── photo w/ parallax ── */}
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
              alt="Inside NOIR — candle-lit dining room"
              fill
              priority
              sizes="430px"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
        {/* cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-base via-base/70 to-transparent" />

        {/* top controls */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...spring, delay: 0.15 }}
          className="absolute inset-x-0 top-0 pt-safe px-5 flex items-center justify-between"
        >
          <button
            className="flex items-center gap-1.5 rounded-full bg-black/35 border border-white/15 backdrop-blur-xl px-3.5 h-11 text-[13px] font-semibold cursor-pointer"
            aria-label="Change delivery address"
          >
            <MapPin size={14} className="text-mute" />
            Deliver to <span className="text-fg">Home</span>
            <ChevronDown size={14} className="text-mute" />
          </button>
          <div className="flex items-center gap-2.5">
            <IconButton label={copied ? "Link copied" : "Share restaurant"} onClick={share}>
              {copied ? <BadgeCheck size={18} /> : <Share size={17} />}
            </IconButton>
            <FavHeart
              active={favActive}
              onToggle={() => toggleFav("__restaurant__")}
            />
          </div>
        </motion.div>

        {/* identity */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...spring, delay: 0.25 }}
            className="flex items-end gap-4"
          >
            <div className="grid size-[64px] shrink-0 place-items-center rounded-2xl bg-fg text-black text-[30px] font-black tracking-tighter shadow-lift ring-1 ring-white/40">
              N
            </div>
            <div className="min-w-0">
              <h1 className="text-[34px] font-black tracking-[-0.03em] leading-none">
                NOIR
              </h1>
              <p className="mt-1.5 text-[15px] text-mute font-medium">
                {RESTAURANT.tagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...spring, delay: 0.34 }}
            className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] font-medium text-mute"
          >
            <span className="flex items-center gap-1 text-fg font-bold">
              <Star size={14} className="fill-star text-star" />
              {RESTAURANT.rating}
            </span>
            <span>({RESTAURANT.reviews.toLocaleString()} reviews)</span>
            <span className="text-dim">·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {RESTAURANT.deliveryTime}
            </span>
            <span className="text-dim">·</span>
            <span>{RESTAURANT.distance}</span>
          </motion.div>
        </div>
      </div>

      {/* ── glass info card ── */}
      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.42 }}
        className="relative z-10 mx-5 -mt-1 rounded-3xl border border-line2 bg-white/[0.05] backdrop-blur-2xl p-4 shadow-lift"
      >
        <div className="grid grid-cols-3 divide-x divide-line text-center">
          <div className="px-2">
            <p className="text-[15px] font-bold tabular-nums">
              {money(RESTAURANT.deliveryFee)}
            </p>
            <p className="mt-0.5 text-[11px] text-dim font-medium leading-tight">
              Delivery · free over {money(RESTAURANT.freeDeliveryOver)}
            </p>
          </div>
          <div className="px-2">
            <p className="text-[15px] font-bold tabular-nums">
              {money(RESTAURANT.minOrder)}
            </p>
            <p className="mt-0.5 text-[11px] text-dim font-medium">Min. order</p>
          </div>
          <div className="px-2">
            <p className="flex items-center justify-center gap-1.5 text-[15px] font-bold">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf/60" />
                <span className="relative inline-flex size-2 rounded-full bg-leaf" />
              </span>
              Open
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
