"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Ogawash Hero Component
 * Full-service laundry & dry cleaning landing hero with ambient mascot & 3-stage animated process scene.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Subtle entrance animation variants for text elements
  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const textItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Stage card reveal variants for scroll/in-view trigger
  const stageContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: shouldReduceMotion ? 0 : 0.35,
      },
    },
  };

  const stageItemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
      scale: shouldReduceMotion ? 1 : 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Mascot ambient idle animation variants
  const mascotIdleVariants = {
    idle: {
      y: shouldReduceMotion ? 0 : [0, -6, 0],
      rotate: shouldReduceMotion ? 0 : [0, 1.2, -1.2, 0],
      transition: {
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const mascotBlinkVariants = {
    idle: {
      scaleY: shouldReduceMotion ? 1 : [1, 1, 0.1, 1, 1, 1],
      transition: {
        duration: 3.8,
        repeat: Infinity,
        times: [0, 0.85, 0.88, 0.91, 0.95, 1],
      },
    },
  };

  const badgePulseVariants = {
    idle: {
      scale: shouldReduceMotion ? 1 : [1, 1.06, 1],
      opacity: shouldReduceMotion ? 1 : [0.9, 1, 0.9],
      transition: {
        duration: 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      ref={heroRef}
      aria-label="Ogawash Hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-start pt-20 pb-24 px-4 sm:px-6 lg:px-8 bg-ink overflow-hidden"
    >
      {/* Background Subtle Gradient & Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 15%, rgba(127, 169, 138, 0.18), transparent 55%),
                            radial-gradient(circle at 80% 60%, rgba(198, 167, 92, 0.08), transparent 45%)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle Dot Matrix Backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#F3F0E8 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Centered Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* Text Stack */}
        <motion.div
          variants={textContainerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-[640px] mx-auto"
        >
          {/* Eyebrow */}
          <motion.div variants={textItemVariants} className="mb-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sage-muted border border-sage/30 text-sage font-utility text-xs sm:text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" aria-hidden="true" />
              FULL-SERVICE LAUNDRY & DRY CLEANING
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={textItemVariants}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-medium text-ivory tracking-tight leading-[1.08] sm:leading-[1.05] mb-5 text-balance"
          >
            Every order, tagged, sorted, sent to the right hands.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={textItemVariants}
            className="font-body text-base sm:text-lg text-muted-text max-w-[480px] leading-relaxed mb-8 text-balance"
          >
            Meet Sage, your AI concierge who manages intake, fabric sorting, and seamless door-to-door delivery with master-cleaner precision.
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={textItemVariants} className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="#talk-to-sage"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-sage text-ink font-body font-semibold text-sm sm:text-base tracking-wide shadow-sage-glow hover:bg-sage-dark hover:text-ivory transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ink transform hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Talk to Sage - AI Laundry Concierge"
            >
              <span>Talk to Sage</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3.33334 8H12.6667M12.6667 8L8.66668 4M12.6667 8L8.66668 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Generous Spacing (~64px) into Centerpiece Illustration */}
        <div className="w-full mt-14 sm:mt-16 relative">
          
          {/* Mascot Header / Floating Guide */}
          <div className="flex flex-col items-center mb-6">
            <motion.div
              variants={mascotIdleVariants}
              animate="idle"
              className="relative flex items-center justify-center"
              aria-label="Sage Mascot Character"
            >
              {/* Mascot Geometric SVG */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                {/* Glow ring */}
                <div className="absolute inset-0 bg-sage/15 rounded-2xl blur-md" aria-hidden="true" />
                
                {/* Mascot Body */}
                <svg
                  className="w-full h-full relative drop-shadow-md"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Sage, friendly AI laundry assistant mascot"
                >
                  {/* Subtle shadow base */}
                  <ellipse cx="40" cy="74" rx="24" ry="4" fill="#0E1012" opacity="0.6" />
                  
                  {/* Main Rounded Body */}
                  <rect
                    x="12"
                    y="14"
                    width="56"
                    height="56"
                    rx="20"
                    fill="#1E2124"
                    stroke="#7FA98A"
                    strokeWidth="2.5"
                  />

                  {/* Concierge Brass Badge Accent */}
                  <circle cx="60" cy="22" r="6" fill="#C6A75C" stroke="#15171A" strokeWidth="1.5" />
                  <path
                    d="M60 19V25M57 22H63"
                    stroke="#15171A"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />

                  {/* Soft Screen Visor */}
                  <rect
                    x="22"
                    y="26"
                    width="36"
                    height="24"
                    rx="10"
                    fill="#15171A"
                    stroke="#33373C"
                    strokeWidth="1.5"
                  />

                  {/* Friendly Eyes with Ambient Blink */}
                  <motion.g variants={mascotBlinkVariants} animate="idle" style={{ transformOrigin: "40px 38px" }}>
                    {/* Left Eye */}
                    <circle cx="33" cy="38" r="3.2" fill="#7FA98A" />
                    <circle cx="34" cy="37" r="1" fill="#F3F0E8" />
                    
                    {/* Right Eye */}
                    <circle cx="47" cy="38" r="3.2" fill="#7FA98A" />
                    <circle cx="48" cy="37" r="1" fill="#F3F0E8" />
                  </motion.g>

                  {/* Friendly Warm Smile */}
                  <path
                    d="M36 43C37.5 45 42.5 45 44 43"
                    stroke="#7FA98A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  {/* Cute Soft Blush Marks */}
                  <ellipse cx="28" cy="42" rx="2" ry="1" fill="#C6A75C" opacity="0.6" />
                  <ellipse cx="52" cy="42" rx="2" ry="1" fill="#C6A75C" opacity="0.6" />
                </svg>
              </div>

              {/* Status Tag Pill attached to Mascot */}
              <motion.div
                variants={badgePulseVariants}
                animate="idle"
                className="absolute -top-3 -right-12 sm:-right-14 px-2.5 py-0.5 rounded-full bg-surface border border-brass/40 shadow-brass-glow flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brass" aria-hidden="true" />
                <span className="font-utility text-[10px] text-brass font-medium uppercase tracking-wider">
                  Sage Active
                </span>
              </motion.div>
            </motion.div>

            <span className="mt-2 text-xs font-utility text-muted-text uppercase tracking-widest">
              Live Order Flow
            </span>
          </div>

          {/* 3-Stage Process Progression Scene */}
          <motion.div
            variants={stageContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative z-10"
            aria-label="Ogawash 3-step concierge process: Smart Intake, Fabric Care & Press, and Crisp Delivery"
          >
            {/* STAGE 1: Intake & Tagging */}
            <motion.div
              variants={stageItemVariants}
              className="group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-surface border border-border-line hover:border-sage/40 transition-colors duration-300 shadow-card-subtle"
            >
              {/* Step indicator badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-ink border border-border-line text-[11px] font-utility text-sage">
                <span>01</span>
              </div>

              {/* Stage SVG Graphic */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 my-2 flex items-center justify-center relative">
                <svg
                  className="w-full h-full text-sage"
                  viewBox="0 0 96 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Canvas Laundry Bag Body */}
                  <path
                    d="M32 30C32 26 36 22 48 22C60 22 64 26 64 30L68 70C68 76 62 80 48 80C34 80 28 76 28 70L32 30Z"
                    fill="#15171A"
                    stroke="#7FA98A"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Bag Cinched Neck */}
                  <path
                    d="M34 30C40 33 56 33 62 30"
                    stroke="#7FA98A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Bag Drawstring Tie */}
                  <path
                    d="M48 24V16M44 16H52"
                    stroke="#C6A75C"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Order Ticket Tag (Brass Accent) */}
                  <rect
                    x="48"
                    y="42"
                    width="26"
                    height="18"
                    rx="3"
                    fill="#1E2124"
                    stroke="#C6A75C"
                    strokeWidth="1.5"
                  />
                  <line x1="52" y1="47" x2="68" y2="47" stroke="#C6A75C" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="52" y1="52" x2="62" y2="52" stroke="#7FA98A" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="50" cy="40" r="1.5" fill="#C6A75C" />
                  <line x1="50" y1="41.5" x2="52" y2="44" stroke="#C6A75C" strokeWidth="1" />
                </svg>
              </div>

              {/* Stage Content */}
              <h3 className="font-display text-lg font-medium text-ivory mb-1.5">
                Smart Intake &amp; Tag
              </h3>
              <p className="font-body text-xs sm:text-sm text-muted-text leading-relaxed">
                Bag is barcoded and digitally logged. Garment care labels are cataloged into Sage’s care matrix.
              </p>
              
              <div className="mt-3 pt-2.5 border-t border-border-line/60 w-full flex items-center justify-between text-[11px] font-utility text-muted-text">
                <span>STAGE</span>
                <span className="text-sage font-medium">BARCODE LOGGED</span>
              </div>
            </motion.div>

            {/* STAGE 2: Care & Steam Press */}
            <motion.div
              variants={stageItemVariants}
              className="group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-surface border border-border-line hover:border-sage/40 transition-colors duration-300 shadow-card-subtle"
            >
              {/* Step indicator badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-ink border border-border-line text-[11px] font-utility text-sage">
                <span>02</span>
              </div>

              {/* Stage SVG Graphic */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 my-2 flex items-center justify-center relative">
                <svg
                  className="w-full h-full text-sage"
                  viewBox="0 0 96 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Stylized Washer / Press Housing */}
                  <rect
                    x="20"
                    y="18"
                    width="56"
                    height="62"
                    rx="8"
                    fill="#15171A"
                    stroke="#7FA98A"
                    strokeWidth="2"
                  />
                  {/* Top Control Panel */}
                  <line x1="20" y1="30" x2="76" y2="30" stroke="#33373C" strokeWidth="1.5" />
                  {/* Brass Dial Knob */}
                  <circle cx="30" cy="24" r="3" fill="#C6A75C" />
                  <circle cx="68" cy="24" r="2" fill="#7FA98A" />
                  <circle cx="62" cy="24" r="2" fill="#7FA98A" opacity="0.6" />

                  {/* Washer Glass Drum Outer */}
                  <circle cx="48" cy="54" r="18" stroke="#7FA98A" strokeWidth="2" fill="#1E2124" />
                  {/* Drum Inner Ring */}
                  <circle cx="48" cy="54" r="12" stroke="#33373C" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  {/* Gentle Hydro Water Wave */}
                  <path
                    d="M38 56C41 54 44 58 48 56C52 54 55 58 58 56"
                    stroke="#7FA98A"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  
                  {/* Steam / Ozone Sparkles */}
                  <path
                    d="M74 38L75 42L79 43L75 44L74 48L73 44L69 43L73 42L74 38Z"
                    fill="#C6A75C"
                    opacity="0.8"
                  />
                </svg>
              </div>

              {/* Stage Content */}
              <h3 className="font-display text-lg font-medium text-ivory mb-1.5">
                Precision Wash &amp; Press
              </h3>
              <p className="font-body text-xs sm:text-sm text-muted-text leading-relaxed">
                Custom water hardness, eco-friendly solvent balance, and delicate hand-finished steam pressing.
              </p>

              <div className="mt-3 pt-2.5 border-t border-border-line/60 w-full flex items-center justify-between text-[11px] font-utility text-muted-text">
                <span>CYCLE</span>
                <span className="text-brass font-medium">CUSTOM THERMAL</span>
              </div>
            </motion.div>

            {/* STAGE 3: Folded & Dispatch Ready */}
            <motion.div
              variants={stageItemVariants}
              className="group relative flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-surface border border-border-line hover:border-sage/40 transition-colors duration-300 shadow-card-subtle"
            >
              {/* Step indicator badge */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-ink border border-border-line text-[11px] font-utility text-sage">
                <span>03</span>
              </div>

              {/* Stage SVG Graphic */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 my-2 flex items-center justify-center relative">
                <svg
                  className="w-full h-full text-sage"
                  viewBox="0 0 96 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Base Garment Fold Bottom */}
                  <rect
                    x="22"
                    y="60"
                    width="52"
                    height="14"
                    rx="4"
                    fill="#15171A"
                    stroke="#7FA98A"
                    strokeWidth="2"
                  />
                  {/* Middle Garment Fold */}
                  <rect
                    x="26"
                    y="46"
                    width="44"
                    height="14"
                    rx="4"
                    fill="#1E2124"
                    stroke="#7FA98A"
                    strokeWidth="2"
                  />
                  {/* Top Garment / Crisp Collar */}
                  <rect
                    x="30"
                    y="32"
                    width="36"
                    height="14"
                    rx="4"
                    fill="#15171A"
                    stroke="#7FA98A"
                    strokeWidth="2"
                  />
                  {/* Collar V-fold */}
                  <path
                    d="M40 32L48 40L56 32"
                    stroke="#7FA98A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Dispatch Brass Seal Badge */}
                  <circle cx="68" cy="30" r="10" fill="#1E2124" stroke="#C6A75C" strokeWidth="1.5" />
                  <path
                    d="M64 30L67 33L73 27"
                    stroke="#C6A75C"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Stage Content */}
              <h3 className="font-display text-lg font-medium text-ivory mb-1.5">
                Crisp Fold &amp; Delivery
              </h3>
              <p className="font-body text-xs sm:text-sm text-muted-text leading-relaxed">
                Packaged in breathable garment shields, sealed with inspection seals, and sent to your doorstep.
              </p>

              <div className="mt-3 pt-2.5 border-t border-border-line/60 w-full flex items-center justify-between text-[11px] font-utility text-muted-text">
                <span>STATUS</span>
                <span className="text-sage font-medium">READY FOR DISPATCH</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Micro Logistics Indicator Footer */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-utility text-muted-text">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Same-Day Express Available</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border-line hidden sm:block" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>End-to-End Barcode Tracking</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border-line hidden sm:block" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Master Cleaner Guarantee</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
