"use client";

import { motion } from "framer-motion";
import { Clock, Navigation } from "lucide-react";
import { RESTAURANT } from "@/data/menu";

/** стилизованная векторная карта с анимированным маршрутом курьера */
export function MapPreview() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-card2">
      <svg viewBox="0 0 400 190" className="block w-full" aria-hidden>
        {/* кварталы */}
        <rect x="24" y="18" width="90" height="60" rx="8" fill="#17150f" opacity="0.05" />
        <rect x="140" y="30" width="70" height="48" rx="8" fill="#17150f" opacity="0.04" />
        <rect x="236" y="14" width="120" height="52" rx="8" fill="#17150f" opacity="0.055" />
        <rect x="30" y="108" width="76" height="60" rx="8" fill="#17150f" opacity="0.04" />
        <rect x="132" y="104" width="86" height="66" rx="8" fill="#17150f" opacity="0.055" />
        <rect x="248" y="96" width="104" height="74" rx="8" fill="#17150f" opacity="0.045" />
        {/* улицы */}
        <path d="M0 90 H400" stroke="#17150f" strokeOpacity="0.1" strokeWidth="7" />
        <path d="M120 0 V190" stroke="#17150f" strokeOpacity="0.09" strokeWidth="6" />
        <path d="M228 0 V190" stroke="#17150f" strokeOpacity="0.08" strokeWidth="5" />
        <path d="M0 26 H400" stroke="#17150f" strokeOpacity="0.06" strokeWidth="3" />
        <path d="M0 150 H400" stroke="#17150f" strokeOpacity="0.06" strokeWidth="3" />
        {/* маршрут */}
        <motion.path
          d="M52 152 L120 152 Q128 152 128 144 L128 98 Q128 90 136 90 L262 90 Q270 90 270 82 L270 52"
          fill="none"
          stroke="#17150f"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 10"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
        />
        {/* точка отправления — чайхана */}
        <circle cx="52" cy="152" r="7" fill="#f2eee7" stroke="#17150f" strokeWidth="2.5" />
        <circle cx="52" cy="152" r="2.5" fill="#17150f" />
      </svg>

      {/* пин назначения */}
      <motion.div
        initial={{ y: -26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 14, delay: 1.4 }}
        className="absolute"
        style={{ left: "64.5%", top: "10%" }}
      >
        <div className="relative">
          <motion.span
            className="absolute -inset-2 rounded-full bg-fg/15"
            animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 1.6 }}
          />
          <span className="relative grid size-8 place-items-center rounded-full bg-fg text-onfg shadow-lift">
            <Navigation size={15} strokeWidth={2.6} className="-translate-x-px translate-y-px" />
          </span>
        </div>
      </motion.div>

      {/* плашки */}
      <div className="absolute bottom-3 left-3 rounded-full border border-line bg-white/85 backdrop-blur-md px-3 py-1.5 text-[12px] font-semibold">
        пр. Чуй, 104 → <span className="text-mute">Дом</span>
      </div>
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-line bg-white/85 backdrop-blur-md px-3 py-1.5 text-[12px] font-bold">
        <Clock size={12.5} className="text-mute" />
        {RESTAURANT.deliveryTime}
      </div>
    </div>
  );
}
