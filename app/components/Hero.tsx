"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Hero Component
 * Matches the reference design with big centered typography, emerald accent,
 * Get Started CTA, and central laundry bag visual with floating animated badges.
 */
export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  // Floating ambient animation for the micro badges
  const floatBadgeVariants: Variants = {
    animate: (custom: number) => ({
      y: shouldReduceMotion ? 0 : [0, -8, 0],
      rotate: shouldReduceMotion ? 0 : [0, custom % 2 === 0 ? 2 : -2, 0],
      transition: {
        duration: 3.5 + custom * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  const entranceVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="hero"
      aria-label="Ogawash Hero"
      className="relative w-full pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/40 via-white to-white overflow-hidden"
    >
      {/* Background Soft Radiant Circles */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-gradient-to-tr from-emerald-200/30 to-teal-100/30 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Main Headline */}
        <motion.h1
          variants={entranceVariants}
          initial="hidden"
          animate="visible"
          className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold text-slate-900 tracking-tight leading-[1.12] sm:leading-[1.08] max-w-4xl mb-6 text-balance"
        >
          Laundry <span className="text-emerald-600">Made</span> Simple, <br className="hidden sm:inline" />
          Fast and Fresh.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={entranceVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="font-sans text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed mb-8 text-balance"
        >
          Schedule a pickup in seconds and get your laundry delivered fresh and folded.
          Reliable service, affordable rates, and zero stress — every time.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          variants={entranceVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="mb-14 sm:mb-16"
        >
          <a
            href="#talk-to-sage"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-sm sm:text-base font-semibold tracking-wide shadow-emerald-glow shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Started
          </a>
        </motion.div>

        {/* Centerpiece Visual: Laundry Duffel Bag with Floating Badges */}
        <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center pt-4 pb-8">
          
          {/* ─────────────────────────────────────────────────────────────
              FLOATING MICRO-BADGES (as seen in the reference)
             ───────────────────────────────────────────────────────────── */}
          
          {/* Badge 1: Top-Left (Dress Shirt) */}
          <motion.div
            custom={1}
            variants={floatBadgeVariants}
            animate="animate"
            className="absolute -top-4 left-4 sm:left-12 p-3 sm:p-3.5 rounded-2xl bg-white shadow-card-hover border border-slate-100 flex items-center justify-center z-20"
            aria-hidden="true"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
            </svg>
          </motion.div>

          {/* Badge 2: Mid-Left (Steam Iron) */}
          <motion.div
            custom={2}
            variants={floatBadgeVariants}
            animate="animate"
            className="absolute top-1/2 -translate-y-1/2 -left-2 sm:left-2 p-3 sm:p-3.5 rounded-2xl bg-white shadow-card-hover border border-slate-100 flex items-center justify-center z-20"
            aria-hidden="true"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 16h20v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z" />
              <path d="M4 16V8a4 4 0 014-4h4a8 8 0 018 8v4" />
              <path d="M8 12h.01" />
              <path d="M12 12h.01" />
              <path d="M16 12h.01" />
            </svg>
          </motion.div>

          {/* Badge 3: Top-Right (Suit Jacket / Hanger) */}
          <motion.div
            custom={3}
            variants={floatBadgeVariants}
            animate="animate"
            className="absolute -top-4 right-4 sm:right-12 p-3 sm:p-3.5 rounded-2xl bg-white shadow-card-hover border border-slate-100 flex items-center justify-center z-20"
            aria-hidden="true"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 00-3 3c0 .88.39 1.67 1 2.22V8L2 14l2 8 8-4 8 4 2-8-8-6v-.78c.61-.55 1-1.34 1-2.22a3 3 0 00-3-3z" />
            </svg>
          </motion.div>

          {/* Badge 4: Mid-Right (Clean Laundry Detergent / Fresh Drop) */}
          <motion.div
            custom={4}
            variants={floatBadgeVariants}
            animate="animate"
            className="absolute top-1/3 -right-2 sm:right-2 p-3 sm:p-3.5 rounded-2xl bg-white shadow-card-hover border border-slate-100 flex items-center justify-center z-20"
            aria-hidden="true"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </motion.div>

          {/* Badge 5: Bottom-Right (Folded Laundry Stack) */}
          <motion.div
            custom={5}
            variants={floatBadgeVariants}
            animate="animate"
            className="absolute -bottom-2 right-6 sm:right-16 p-3 sm:p-3.5 rounded-2xl bg-white shadow-card-hover border border-slate-100 flex items-center justify-center z-20"
            aria-hidden="true"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="4" rx="2" />
              <rect x="3" y="11" width="18" height="4" rx="2" />
              <rect x="4" y="17" width="16" height="4" rx="2" />
            </svg>
          </motion.div>

          {/* Central High-Fidelity Duffel Bag SVG Representation */}
          <div className="relative w-full max-w-lg aspect-[16/10] flex items-center justify-center">
            <svg
              className="w-full h-full drop-shadow-2xl"
              viewBox="0 0 540 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Ogawash Premium Laundry Duffel Bag"
            >
              <defs>
                {/* Bag Fabric Gradients */}
                <linearGradient id="duffelBody" x1="0" y1="100" x2="540" y2="300" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#64748B" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>

                <linearGradient id="duffelHighlight" x1="270" y1="100" x2="270" y2="280" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                <linearGradient id="strapGrad" x1="0" y1="40" x2="0" y2="280" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>

                <filter id="shadowAura" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#0F172A" floodOpacity="0.2" />
                </filter>
              </defs>

              {/* Floor Shadow */}
              <ellipse cx="270" cy="295" rx="220" ry="18" fill="#0F172A" opacity="0.15" />

              {/* Main Barrel Duffel Body */}
              <g filter="url(#shadowAura)">
                <rect x="70" y="100" width="400" height="175" rx="55" fill="url(#duffelBody)" />
                
                {/* Cylindrical Side End-Caps */}
                <ellipse cx="110" cy="187.5" rx="35" ry="87.5" fill="#334155" />
                <ellipse cx="110" cy="187.5" rx="30" ry="80" fill="#475569" />
                <ellipse cx="430" cy="187.5" rx="35" ry="87.5" fill="#475569" />

                {/* Central Front Panel Highlight */}
                <path
                  d="M130 115C200 108 340 108 410 115L415 260C340 268 200 268 125 260Z"
                  fill="url(#duffelHighlight)"
                  opacity="0.9"
                />

                {/* Horizontal Heavy Zipper Track */}
                <path d="M120 128H420" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
                <path d="M120 128H420" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />

                {/* Silver Metal Zipper Pull */}
                <rect x="255" y="123" width="14" height="18" rx="3" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
                <circle cx="262" cy="130" r="2.5" fill="#0F172A" />

                {/* Reinforced Webbing Straps (Vertical Front Bands) */}
                <path d="M190 98V270" stroke="url(#strapGrad)" strokeWidth="24" strokeLinecap="round" />
                <path d="M190 98V270" stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />

                <path d="M350 98V270" stroke="url(#strapGrad)" strokeWidth="24" strokeLinecap="round" />
                <path d="M350 98V270" stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />

                {/* Handle Arch (Over the top) */}
                <path
                  d="M190 100C190 35 350 35 350 100"
                  stroke="url(#strapGrad)"
                  strokeWidth="22"
                  strokeLinecap="round"
                />

                {/* Padded Top Comfort Grip */}
                <rect x="215" y="34" width="110" height="34" rx="10" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                <line x1="225" y1="44" x2="315" y2="44" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4 3" />
                <line x1="225" y1="58" x2="315" y2="58" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4 3" />

                {/* Ogawash Brand Patch on Front Center */}
                <rect x="235" y="175" width="70" height="40" rx="8" fill="#10B981" />
                <text x="270" y="196" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                  OGAWASH
                </text>
                <text x="270" y="207" fill="#D1FAE5" fontSize="7" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
                  CARE MATRIX
                </text>
              </g>
            </svg>
          </div>

        </div>

      </div>
    </section>
  );
}
