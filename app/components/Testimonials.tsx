"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  descriptor: string;
  initials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    quote: "Messaging Sage to book a doorstep pickup takes ten seconds. The clothes return folded impeccably and right on schedule.",
    author: "Elena Rostova",
    descriptor: "Weekly pickup customer",
    initials: "ER",
  },
  {
    id: "test-2",
    quote: "Our silk and linen garments always come back in pristine condition. Knowing master cleaners oversee every load gives complete peace of mind.",
    author: "Marcus Chen",
    descriptor: "Dry cleaning client",
    initials: "MC",
  },
  {
    id: "test-3",
    quote: "The same-day express turnaround saved me before a last-minute business trip. Crisp collars, perfectly pressed, zero friction.",
    author: "Sarah Lindqvist",
    descriptor: "Express regular",
    initials: "SL",
  },
];

/**
 * Testimonials Component
 * Understated, calm social proof with centered headline and initials badges.
 */
export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion();

  // Subdued fade-in container variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.1,
      },
    },
  };

  // Subdued fade-in item variants (gentle, no aggressive slide)
  const itemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      aria-label="Customer Testimonials"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-ink border-t border-border-line/60 overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Centered Header Stack */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-12 sm:mb-16">
          {/* Eyebrow */}
          <div className="mb-3.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sage-muted border border-sage/30 text-sage font-utility text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" aria-hidden="true" />
              WHAT CUSTOMERS SAY
            </span>
          </div>

          {/* Centered Headline */}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-ivory tracking-tight leading-tight">
            Trusted with the everyday
          </h2>
        </div>

        {/* 3 Testimonial Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="flex flex-col justify-between p-6 rounded-2xl bg-surface/60 border border-border-line/70 hover:border-border-line transition-colors duration-200"
            >
              {/* Quote Body */}
              <p className="font-body text-xs sm:text-sm text-ivory/90 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author Info with Mono Initials Badge */}
              <div className="flex items-center gap-3 pt-4 border-t border-border-line/40">
                {/* Initials Badge */}
                <div
                  className="w-8 h-8 rounded-full bg-sage/20 border border-sage/40 flex items-center justify-center text-sage font-utility text-xs font-semibold shrink-0"
                  aria-hidden="true"
                >
                  {testimonial.initials}
                </div>

                {/* Name & Descriptor */}
                <div className="flex flex-col">
                  <span className="font-body text-xs sm:text-sm font-medium text-ivory leading-snug">
                    {testimonial.author}
                  </span>
                  <span className="font-utility text-[11px] text-muted-text">
                    {testimonial.descriptor}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
