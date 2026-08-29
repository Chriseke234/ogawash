"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  details: string;
}

const SERVICES: ServiceItem[] = [
  {
    number: "01",
    title: "Wash & Fold",
    description: "Everyday loads, sorted and folded to your preference.",
    details: "Detergent customization • 24h turnaround",
  },
  {
    number: "02",
    title: "Dry Cleaning",
    description: "Suits, gowns, and delicates handled with care.",
    details: "Eco-friendly solvent • Hand pressing",
  },
  {
    number: "03",
    title: "Pickup & Delivery",
    description: "We come to you, on a schedule that fits yours.",
    details: "Doorstep concierge • Live tracking",
  },
  {
    number: "04",
    title: "Express",
    description: "Same-day turnaround when you're in a bind.",
    details: "In by 10 AM, back by 6 PM",
  },
];

/**
 * Services Component
 * 4-card service lane grid with left-aligned headline and staggered entrance.
 */
export default function Services() {
  const shouldReduceMotion = useReducedMotion();

  // Container variants for staggered entrance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  // Card slide/fade variants matching HowItWorks pattern
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="services"
      aria-label="Ogawash Services"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-ink border-t border-border-line/60 overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-sage/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        
        {/* Left-Aligned Header Stack */}
        <div className="flex flex-col items-start mb-12 sm:mb-16">
          {/* Eyebrow */}
          <div className="mb-3.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sage-muted border border-sage/30 text-sage font-utility text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" aria-hidden="true" />
              SERVICES
            </span>
          </div>

          {/* Left-Aligned Headline */}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-ivory tracking-tight leading-[1.1] max-w-2xl">
            Whatever the load, there&apos;s a lane for it
          </h2>
        </div>

        {/* 4-Card Service Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.number}
              variants={cardVariants}
              tabIndex={0}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-surface border border-border-line hover:border-sage/40 transition-all duration-300 shadow-card-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              <div>
                {/* Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-utility text-sm font-semibold text-sage tracking-wider">
                    {service.number}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-border-line group-hover:bg-sage transition-colors duration-300" />
                </div>

                {/* Sub-headline */}
                <h3 className="font-display text-lg sm:text-xl font-medium text-ivory mb-2 group-hover:text-sage-light transition-colors duration-200">
                  {service.title}
                </h3>

                {/* Body Description */}
                <p className="font-body text-xs sm:text-sm text-muted-text leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              {/* Service Feature Tag Line */}
              <div className="pt-3 border-t border-border-line/60 font-utility text-[11px] text-muted-text/90 group-hover:text-sage transition-colors">
                {service.details}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
