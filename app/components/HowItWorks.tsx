"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface StepItem {
  number: string;
  title: string;
  description: string;
  tag: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "You message Sage",
    description: "Tell her what you need in plain text or voice. No rigid forms, dropdown menus, or account setups required.",
    tag: "CONVERSATIONAL INTAKE",
  },
  {
    number: "02",
    title: "She writes the ticket",
    description: "Service type, garment breakdown, turnaround timing, and special fabric care notes are captured with zero error.",
    tag: "PRECISION LOGGING",
  },
  {
    number: "03",
    title: "It's routed instantly",
    description: "Whether it’s courier pickup, same-day express, standard in-store, or specialty care needing a human eye, orders route automatically.",
    tag: "AUTOMATED DISPATCH",
  },
];

/**
 * HowItWorks Component
 * Left-aligned 3-step sequence with animated drawing left-border accents.
 */
export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  // Container variants for staggered entrance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Step item slide/fade variants
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: "easeOut",
      },
    },
  };

  // Border draw animation variants (height from 0% to 100%)
  const borderVariants: Variants = {
    hidden: { scaleY: shouldReduceMotion ? 1 : 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="how-it-works"
      aria-label="How Ogawash Works"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-ink border-t border-border-line/60 overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-sage/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        
        {/* Left-Aligned Header Stack */}
        <div className="flex flex-col items-start mb-12 sm:mb-16">
          {/* Eyebrow matching Hero style */}
          <div className="mb-3.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sage-muted border border-sage/30 text-sage font-utility text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" aria-hidden="true" />
              HOW IT WORKS
            </span>
          </div>

          {/* Left-Aligned Headline */}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-ivory tracking-tight leading-[1.1] max-w-2xl">
            Three steps, from message to machine
          </h2>
        </div>

        {/* 3-Step Grid / Sequence */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 lg:gap-10"
        >
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative pl-6 sm:pl-7 flex flex-col justify-between group"
            >
              {/* Animated Drawing Left Border Accent (2px Sage) */}
              <motion.div
                variants={borderVariants}
                style={{ originY: 0 }}
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sage via-sage to-sage/40 rounded-full"
                aria-hidden="true"
              />

              {/* Step Content */}
              <div>
                {/* Step Number & Micro Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-utility text-sm sm:text-base font-semibold text-sage tracking-wider">
                    {step.number}
                  </span>
                  <span className="font-utility text-[10px] text-muted-text uppercase tracking-widest px-2 py-0.5 rounded bg-surface border border-border-line">
                    {step.tag}
                  </span>
                </div>

                {/* Subheadline */}
                <h3 className="font-display text-lg sm:text-xl font-medium text-ivory mb-2.5 group-hover:text-sage-light transition-colors duration-200">
                  {step.title}
                </h3>

                {/* Body Description */}
                <p className="font-body text-xs sm:text-sm text-muted-text leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Decorative Subtle Step Connector Line for Desktop */}
              {index < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute -right-4 lg:-right-5 top-1/3 w-3 h-[1px] bg-border-line"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
