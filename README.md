# Ogawash — Full-Service Laundry & Dry Cleaning

A modern, high-performance marketing landing page for **Ogawash**, featuring an AI concierge named **Sage** who manages intake, fabric sorting, and doorstep dispatch.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Design System & Tokens

- **Background (Ink Charcoal)**: `#15171A`
- **Surface**: `#1E2124`
- **Border / Line**: `#33373C`
- **Text Primary (Ivory)**: `#F3F0E8`
- **Text Muted**: `#93979C`
- **Primary Accent (Sage Green)**: `#7FA98A` (Hover `#5C8268`)
- **Secondary Accent (Brass)**: `#C6A75C`
- **Headlines**: `Fraunces` (Google Font serif)
- **Body**: `Inter` (Google Font sans-serif)
- **Utility / Micro-copy**: `Monic` (with `IBM Plex Mono` fallback)

---

## Features

- **Hero Section**: Centered layout, Fraunces headline, Sage concierge CTA, and a centerpiece dual-layer animated mascot & 3-stage process illustration.
- **How It Works**: 3-step sequence with animated drawing left-border accents.
- **Staff Dashboard Preview**: 4-column live Kanban preview (`Pickup & Delivery`, `Express`, `In-Store`, `Needs a Human`).
- **Services**: 4-card service lane grid (`Wash & Fold`, `Dry Cleaning`, `Pickup & Delivery`, `Express`).
- **Testimonials**: Understated customer social proof with initials badges.
- **Persistent Floating Chat Widget ("Sage")**: 3-state conversational AI assistant with single-shot delayed bounce, speech tooltip, and responsive chat panel.
- **Accessibility & Motion**: Complete `prefers-reduced-motion` compliance, semantic markup, and WCAG AA contrast.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production (Vercel)
```bash
npm run build
npm run start
```
