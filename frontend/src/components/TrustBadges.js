'use client';

import React from 'react';
import { motion } from 'framer-motion';

// SVG 3D Metallic Gold Icon 1: 100% Original Products
const OriginalProductsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-16 md:h-16 filter drop-shadow-[0_4px_6px_rgba(142,110,40,0.18)]">
    <defs>
      <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF4D0" />
        <stop offset="20%" stopColor="#E6C47E" />
        <stop offset="40%" stopColor="#B38D3F" />
        <stop offset="60%" stopColor="#FFECA8" />
        <stop offset="80%" stopColor="#D4AE5E" />
        <stop offset="100%" stopColor="#8C6627" />
      </linearGradient>
      <radialGradient id="goldDome" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFF9E6" />
        <stop offset="30%" stopColor="#E5C07B" />
        <stop offset="70%" stopColor="#B38F37" />
        <stop offset="100%" stopColor="#6E4F18" />
      </radialGradient>
    </defs>
    <path
      d="M 50 10 L 53 14 L 59 12 L 61 17 L 67 17 L 68 22 L 74 23 L 73 29 L 78 31 L 76 37 L 80 40 L 77 46 L 80 51 L 76 56 L 77 62 L 72 65 L 72 71 L 66 72 L 64 78 L 58 78 L 55 83 L 50 81 L 45 83 L 42 78 L 36 78 L 34 72 L 28 71 L 28 65 L 23 62 L 24 56 L 20 51 L 23 46 L 20 40 L 24 37 L 22 31 L 27 29 L 26 23 L 32 22 L 33 17 L 39 17 L 41 12 L 47 14 Z"
      fill="url(#goldDome)"
    />
    <circle cx="50" cy="46" r="23" fill="none" stroke="#FFF9E6" strokeWidth="1.5" opacity="0.7" />
    <path
      d="M 39 46 L 46 53 L 61 37"
      fill="none"
      stroke="#523910"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 39 46 L 46 53 L 61 37"
      fill="none"
      stroke="#FFF4D0"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// SVG 3D Metallic Gold Icon 2: Free Delivery
const FreeDeliveryIcon = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-16 md:h-16 filter drop-shadow-[0_4px_6px_rgba(142,110,40,0.18)]">
    <defs>
      <linearGradient id="goldMetallicLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF9E6" />
        <stop offset="50%" stopColor="#EBD09B" />
        <stop offset="100%" stopColor="#C99E55" />
      </linearGradient>
      <linearGradient id="goldMetallicDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C99E55" />
        <stop offset="50%" stopColor="#A8803E" />
        <stop offset="100%" stopColor="#694C1B" />
      </linearGradient>
      <linearGradient id="goldMetallicMed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0C18A" />
        <stop offset="50%" stopColor="#BA9759" />
        <stop offset="100%" stopColor="#8C6A30" />
      </linearGradient>
    </defs>
    <path d="M 50 18 L 82 32 L 50 46 L 18 32 Z" fill="url(#goldMetallicLight)" />
    <path d="M 18 32 L 50 46 V 78 L 18 64 Z" fill="url(#goldMetallicDark)" />
    <path d="M 50 46 L 82 32 V 64 L 50 78 Z" fill="url(#goldMetallicMed)" />
    <path d="M 50 32 L 66 39 L 50 46 L 34 39 Z" fill="#FFF9E6" opacity="0.3" />
    <path d="M 50 46 L 50 78" stroke="#523910" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

// SVG 3D Metallic Gold Icon 3: Express Delivery
const ExpressDeliveryIcon = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-16 md:h-16 filter drop-shadow-[0_4px_6px_rgba(142,110,40,0.18)]">
    <line x1="8" y1="36" x2="26" y2="36" stroke="url(#goldMetallicLight)" strokeWidth="3" strokeLinecap="round" />
    <line x1="4" y1="48" x2="22" y2="48" stroke="url(#goldMetallicMed)" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="9" y1="60" x2="25" y2="60" stroke="url(#goldMetallicDark)" strokeWidth="3" strokeLinecap="round" />
    <rect x="30" y="28" width="40" height="32" rx="2" fill="url(#goldMetallicMed)" />
    <path d="M 30 28 H 70 V 60 H 30 Z" fill="url(#goldDome)" opacity="0.4" />
    <path d="M 70 38 H 82 Q 87 38 89 44 L 92 50 Q 94 53 94 56 V 60 H 70 Z" fill="url(#goldMetallicLight)" />
    <path d="M 73 42 H 80 L 85 50 H 73 Z" fill="#694C1B" opacity="0.8" />
    <circle cx="44" cy="68" r="10" fill="#523910" />
    <circle cx="44" cy="68" r="7" fill="url(#goldMetallicLight)" />
    <circle cx="44" cy="68" r="3" fill="#694C1B" />
    <circle cx="74" cy="68" r="10" fill="#523910" />
    <circle cx="74" cy="68" r="7" fill="url(#goldMetallicLight)" />
    <circle cx="74" cy="68" r="3" fill="#694C1B" />
  </svg>
);

// SVG 3D Metallic Gold Icon 4: Easy Exchange & Returns
const EasyExchangeIcon = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-16 md:h-16 filter drop-shadow-[0_4px_6px_rgba(142,110,40,0.18)]">
    <g transform="translate(18, 18) scale(0.64)">
      <path d="M 50 18 L 82 32 L 50 46 L 18 32 Z" fill="url(#goldMetallicLight)" />
      <path d="M 18 32 L 50 46 V 78 L 18 64 Z" fill="url(#goldMetallicDark)" />
      <path d="M 50 46 L 82 32 V 64 L 50 78 Z" fill="url(#goldMetallicMed)" />
      <path d="M 50 46 L 50 78" stroke="#523910" strokeWidth="1.5" opacity="0.5" />
    </g>
    <path
      d="M 28 22 A 38 38 0 0 1 82 38"
      fill="none"
      stroke="url(#goldMetallicMed)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M 83 28 L 83 40 L 71 39"
      fill="none"
      stroke="url(#goldMetallicLight)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 72 78 A 38 38 0 0 1 18 62"
      fill="none"
      stroke="url(#goldMetallicMed)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M 17 72 L 17 60 L 29 61"
      fill="none"
      stroke="url(#goldMetallicLight)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// SVG 3D Metallic Gold Icon 5: Secure Payments
const SecurePaymentsIcon = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-16 md:h-16 filter drop-shadow-[0_4px_6px_rgba(142,110,40,0.18)]">
    <path
      d="M 50 10 C 66 10 80 18 82 35 C 84 57 66 75 50 84 C 34 75 16 57 18 35 C 20 18 34 10 50 10 Z"
      fill="url(#goldDome)"
    />
    <path
      d="M 50 16 C 62 16 74 22 75 36 C 77 53 62 69 50 77 C 38 69 23 53 25 36 C 26 22 38 16 50 16 Z"
      fill="url(#goldMetallicDark)"
      opacity="0.8"
    />
    <path
      d="M 40 46 V 38 A 10 10 0 0 1 60 38 V 46"
      fill="none"
      stroke="url(#goldMetallicLight)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <rect x="35" y="44" width="30" height="22" rx="3.5" fill="url(#goldMetallicLight)" />
    <circle cx="50" cy="52" r="3" fill="#523910" />
    <path d="M 50 54 L 52 61 H 48 Z" fill="#523910" />
  </svg>
);

// SVG 3D Metallic Gold Icon 6: India's Leading Online Perfume Store
const IndiaLeadingIcon = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 md:w-16 md:h-16 filter drop-shadow-[0_4px_6px_rgba(142,110,40,0.18)]">
    <path d="M 40 55 L 26 86 L 42 78 L 48 55 Z" fill="url(#goldMetallicDark)" />
    <path d="M 60 55 L 74 86 L 58 78 L 52 55 Z" fill="url(#goldMetallicDark)" />
    <circle cx="50" cy="42" r="26" fill="url(#goldDome)" />
    <circle cx="50" cy="42" r="21" fill="none" stroke="#FFF9E6" strokeWidth="2.2" opacity="0.7" />
    <circle cx="50" cy="42" r="18" fill="url(#goldMetallicLight)" />
    <text
      x="50"
      y="50"
      textAnchor="middle"
      fontSize="21"
      fontWeight="900"
      fontFamily="'Cinzel', 'Times New Roman', serif"
      fill="#523910"
      className="select-none"
    >
      #1
    </text>
  </svg>
);

export default function TrustBadges({ detailed = false }) {
  const badges = [
    {
      icon: <OriginalProductsIcon />,
      title: '100% Original',
      subtitle: 'Products',
      description: 'Imported Grasse oils certified authentic',
    },
    {
      icon: <FreeDeliveryIcon />,
      title: 'Free',
      subtitle: 'Delivery',
      description: 'Complimentary shipping above ₹999',
    },
    {
      icon: <ExpressDeliveryIcon />,
      title: 'Express',
      subtitle: 'Delivery',
      description: 'Dispatched within 24 hours nationwide',
    },
    {
      icon: <EasyExchangeIcon />,
      title: 'Easy Exchange',
      subtitle: '& Returns',
      description: 'Hassle-free support for tester packs',
    },
    {
      icon: <SecurePaymentsIcon />,
      title: 'Secure',
      subtitle: 'Payments',
      description: '256-bit SSL encrypted transactions',
    },
    {
      icon: <IndiaLeadingIcon />,
      title: "India's Leading",
      subtitle: 'Online Perfume Store',
      description: 'Trusted by over 100,000 scent lovers',
    },
  ];

  if (detailed) {
    // A smaller compact variant specifically for the Product detail card page
    return (
      <div className="bg-[#FAF8F5] border border-gold/15 rounded-xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-widest text-gold font-sans font-bold">Orova Promise</span>
          <h4 className="font-serif text-sm font-bold text-[#1C1917] mt-0.5">Why Buy From Us?</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center space-x-3 text-left">
              <div className="flex-shrink-0">{badge.icon}</div>
              <div>
                <p className="font-serif text-xs font-bold text-[#1C1917] leading-tight">
                  {badge.title} {badge.subtitle}
                </p>
                <p className="text-[9px] text-zinc-500 font-sans mt-0.5 leading-none">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standard full-width home-page trust banner
  return (
    <section className="bg-white border-y border-gold/10 py-10 md:py-14 shadow-[0_1px_3px_rgba(168,128,32,0.05)] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-6">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center group cursor-default"
            >
              {/* Icon Container with elegant hover zoom */}
              <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center h-16 w-16">
                {badge.icon}
              </div>

              {/* Bold Primary text label */}
              <h3 className="font-sans text-xs sm:text-[13px] font-extrabold text-[#1C1917] tracking-tight leading-tight uppercase group-hover:text-gold transition-colors duration-300">
                {badge.title}
                <span className="block font-sans text-xs sm:text-[13px] font-extrabold text-[#1C1917] tracking-tight leading-tight uppercase">
                  {badge.subtitle}
                </span>
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
