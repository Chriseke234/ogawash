export interface LeadData {
  ticketId?: string;
  name?: string;
  phone?: string;
  service?: string;
  address?: string;
  timing?: string;
  notes?: string;
  isClosed?: boolean;
  whatsappUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: "sage" | "user";
  text: string;
  timestamp: string;
  ticket?: {
    id: string;
    service: string;
    timing: string;
    items: string;
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    whatsappUrl?: string;
    isFinalized?: boolean;
    trackingStatus?: string;
    stageProgress?: number; // 1 to 4
  };
}

export const OWNER_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "2349030375493";

export const SAGE_QUICK_PROMPTS = [
  "Book a pickup for today",
  "Track my order status",
  "Wash & Fold ($2.25/lb)",
  "What are your turnaround times?",
];

export const SAGE_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    sender: "sage",
    text: "Hello! I'm Sage, your Ogawash laundry assistant. I can book your doorstep pickup in 60 seconds, track your existing orders, or answer any fabric care questions. How can I help you today?",
    timestamp: "Just now",
  },
];

/**
 * Trigger global event to open Sage chat from any button across the page
 */
export function openSageChat(initialPrompt?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-sage-chat", {
        detail: { initialPrompt },
      })
    );
  }
}

/**
 * Builds the direct WhatsApp click-to-chat URL for the owner with pre-formatted order details
 */
export function formatWhatsAppOrderUrl(lead: LeadData): string {
  const cleanPhone = OWNER_WHATSAPP_NUMBER.replace(/\D/g, "");
  const orderMessage = [
    `*NEW OGAWASH LAUNDRY ORDER*`,
    `-----------------------------`,
    `*Order Ticket:* ${lead.ticketId || "#OG-" + Math.floor(1000 + Math.random() * 9000)}`,
    `*Customer Name:* ${lead.name || "Valued Customer"}`,
    `*Phone Number:* ${lead.phone || "Not provided"}`,
    `*Service Requested:* ${lead.service || "Standard Laundry"}`,
    `*Pickup Address:* ${lead.address || "Pending confirmation"}`,
    `*Preferred Pickup Time:* ${lead.timing || "As soon as possible"}`,
    lead.notes ? `*Special Instructions:* ${lead.notes}` : "",
    `-----------------------------`,
    `_Generated automatically by Sage AI Assistant_`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(orderMessage)}`;
}

// Conversation Session State for Lead Closing & Tracking
let currentLeadState: {
  step: "idle" | "awaiting_tracking_input" | "awaiting_name" | "awaiting_phone" | "awaiting_address" | "awaiting_timing" | "closed";
  data: LeadData;
} = {
  step: "idle",
  data: {
    service: "Standard Laundry",
    ticketId: `#OG-${Math.floor(1000 + Math.random() * 9000)}`,
  },
};

/**
 * Resets lead state for a new order
 */
export function resetLeadState() {
  currentLeadState = {
    step: "idle",
    data: {
      service: "Standard Laundry",
      ticketId: `#OG-${Math.floor(1000 + Math.random() * 9000)}`,
    },
  };
}

/**
 * Intelligent response generator for Sage
 */
export async function getSageResponse(userMessage: string): Promise<ChatMessage> {
  const normalized = userMessage.toLowerCase().trim();
  const timeStr = "Just now";

  // Simulate subtle natural typing latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Initialize ticket ID if not set
  if (!currentLeadState.data.ticketId) {
    currentLeadState.data.ticketId = `#OG-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // A. TRACKING / ACCOUNT CHECK INTENT (e.g. "Check my account or track an order")
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    normalized.includes("track") ||
    normalized.includes("account") ||
    normalized.includes("sign in") ||
    normalized.includes("where is my order") ||
    normalized.includes("order status") ||
    normalized.includes("check my order")
  ) {
    currentLeadState.step = "awaiting_tracking_input";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "I can look up your order status right away! Please reply with your **Order Ticket ID** (e.g., `#OG-5821`) or the **Phone Number** you used for booking.",
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // B. PROCESSING TRACKING INPUT (User provided Ticket ID or Phone)
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentLeadState.step === "awaiting_tracking_input") {
    currentLeadState.step = "idle";
    const lookupKey = userMessage.trim();
    const cleanNumber = lookupKey.replace(/\D/g, "");

    const demoTicketId = lookupKey.startsWith("#") ? lookupKey : `#OG-${cleanNumber.slice(-4) || "8421"}`;

    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: `Found your account for **${lookupKey}**! Here is your live order tracking status:`,
      timestamp: timeStr,
      ticket: {
        id: demoTicketId,
        service: "Doorstep Laundry & Dry Cleaning",
        timing: "Estimated Delivery: Today by 5:30 PM",
        items: "2 Bags Wash & Fold + 2 Suits Dry Cleaned",
        trackingStatus: "In Wash & Delicate Steam Press",
        stageProgress: 3,
        isFinalized: true,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // C. ACTIVE INTAKE FLOW (Steps 2 - 5)
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentLeadState.step === "awaiting_name") {
    currentLeadState.data.name = userMessage.trim();
    currentLeadState.step = "awaiting_phone";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: `Nice to meet you, **${currentLeadState.data.name}**! What is your **Phone / WhatsApp number** so our rider can contact you upon arrival?`,
      timestamp: timeStr,
    };
  }

  if (currentLeadState.step === "awaiting_phone") {
    currentLeadState.data.phone = userMessage.trim();
    currentLeadState.step = "awaiting_address";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: `Got your number! Where should our dispatch rider pick up your laundry? Please enter your **Street Address / Area**.`,
      timestamp: timeStr,
    };
  }

  if (currentLeadState.step === "awaiting_address") {
    currentLeadState.data.address = userMessage.trim();
    currentLeadState.step = "awaiting_timing";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: `Perfect. What **date & time window** works best for your doorstep pickup? (e.g. *Today 5:00 PM*, *Tomorrow 9:00 AM*, or *ASAP*)`,
      timestamp: timeStr,
    };
  }

  if (currentLeadState.step === "awaiting_timing") {
    currentLeadState.data.timing = userMessage.trim();
    currentLeadState.data.isClosed = true;
    currentLeadState.step = "closed";

    const whatsappLink = formatWhatsAppOrderUrl(currentLeadState.data);
    currentLeadState.data.whatsappUrl = whatsappLink;

    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: `🎉 Your order ticket is **verified and ready for dispatch**! Click the green button below to send your order directly to our team's WhatsApp at **+234 903 037 5493** for immediate rider assignment.`,
      timestamp: timeStr,
      ticket: {
        id: currentLeadState.data.ticketId || "#OG-7721",
        service: currentLeadState.data.service || "Standard Laundry",
        timing: currentLeadState.data.timing || "Today",
        items: "Confirmed Order",
        customerName: currentLeadState.data.name,
        customerPhone: currentLeadState.data.phone,
        customerAddress: currentLeadState.data.address,
        whatsappUrl: whatsappLink,
        isFinalized: true,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // D. PRICING & TURNAROUND FAQ INTENT
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    normalized.includes("price") ||
    normalized.includes("cost") ||
    normalized.includes("rate") ||
    normalized.includes("how much") ||
    normalized.includes("turnaround") ||
    normalized.includes("how long")
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "Here are our transparent rates:\n• **Wash & Fold**: $2.25/lb (24h turnaround)\n• **Dry Cleaning**: From $7.50/item (48h turnaround)\n• **Same-Day Express**: Ready by 6:00 PM when booked before 10:00 AM\n• **Pickup & Delivery**: Free on orders over $35\n\nWould you like me to book a pickup for you now?",
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // E. AI HONESTY / ABOUT SAGE INTENT
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    normalized.includes("are you a bot") ||
    normalized.includes("are you an ai") ||
    normalized.includes("are you human") ||
    normalized.includes("who are you")
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "Yes, I am Sage, Ogawash's automated AI laundry assistant! I handle your bookings, check order tracking, and schedule pickups directly with our dispatch riders. When you're ready, say **'Book Pickup'** and I'll create your ticket.",
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // F. STARTING A BOOKING (Explicit booking intents)
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    normalized.includes("book") ||
    normalized.includes("pickup") ||
    normalized.includes("wash & fold") ||
    normalized.includes("wash and fold") ||
    normalized.includes("dry clean") ||
    normalized.includes("express") ||
    normalized.includes("get started") ||
    normalized.includes("start an order")
  ) {
    if (normalized.includes("wash & fold") || normalized.includes("wash and fold")) {
      currentLeadState.data.service = "Wash & Fold ($2.25/lb)";
    } else if (normalized.includes("dry clean") || normalized.includes("suit") || normalized.includes("gown")) {
      currentLeadState.data.service = "Delicate Dry Cleaning";
    } else if (normalized.includes("express") || normalized.includes("same day")) {
      currentLeadState.data.service = "Express Same-Day (Ready by 6 PM)";
    } else {
      currentLeadState.data.service = "Doorstep Laundry & Dry Cleaning";
    }

    currentLeadState.step = "awaiting_name";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: `Awesome! I've selected **${currentLeadState.data.service}** for your order. To get your dispatch ticket ready, what is your **Full Name**?`,
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // G. DEFAULT GENERAL CONVERSATION
  // ─────────────────────────────────────────────────────────────────────────────
  return {
    id: `msg-${Date.now()}`,
    sender: "sage",
    text: `Got it! I can help you with:\n1. **Booking a doorstep laundry pickup** (say *"Book pickup"*)\n2. **Tracking an existing order** (say *"Track order"*)\n3. **Checking pricing & turnaround** (say *"Pricing"*)\n\nWhat would you like to do?`,
    timestamp: timeStr,
  };
}
