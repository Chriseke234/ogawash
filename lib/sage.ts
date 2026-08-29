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
  };
}

export const OWNER_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "2349030375493";

export const SAGE_QUICK_PROMPTS = [
  "Book a pickup for today",
  "Wash & Fold Service",
  "Delicate Dry Cleaning",
  "Same-Day Express",
];

export const SAGE_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    sender: "sage",
    text: "Hello! I'm Sage, your Ogawash laundry assistant. I can book your doorstep pickup in 60 seconds and send your order straight to our dispatch team on WhatsApp. What service would you like today?",
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

// Conversation Session State for Lead Closing
let currentLeadState: {
  step: "idle" | "awaiting_name" | "awaiting_phone" | "awaiting_address" | "awaiting_timing" | "closed";
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
 * Intelligent lead-closing response generator for Sage
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
  // 1. SERVICE SELECTION / INTAKE TRIGGER
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    currentLeadState.step === "idle" ||
    normalized.includes("book") ||
    normalized.includes("pickup") ||
    normalized.includes("start") ||
    normalized.includes("wash & fold") ||
    normalized.includes("wash and fold") ||
    normalized.includes("dry clean") ||
    normalized.includes("express")
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
  // 2. NAME CAPTURED -> ASK FOR PHONE / WHATSAPP NUMBER
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PHONE CAPTURED -> ASK FOR PICKUP ADDRESS
  // ─────────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. ADDRESS CAPTURED -> ASK FOR TIMING
  // ─────────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. TIMING CAPTURED -> LEAD CLOSED & WHATSAPP DISPATCH READY
  // ─────────────────────────────────────────────────────────────────────────────
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
  // 6. DEFAULT AFTER CLOSED OR GENERAL QUESTIONS
  // ─────────────────────────────────────────────────────────────────────────────
  const whatsappLink = formatWhatsAppOrderUrl(currentLeadState.data);
  return {
    id: `msg-${Date.now()}`,
    sender: "sage",
    text: `Got it! If you need to send this order to our team, click the button below to dispatch it on WhatsApp, or let me know if you want to update any details.`,
    timestamp: timeStr,
    ticket: {
      id: currentLeadState.data.ticketId || "#OG-7721",
      service: currentLeadState.data.service || "Standard Laundry",
      timing: currentLeadState.data.timing || "Today",
      items: "Order Ready",
      customerName: currentLeadState.data.name,
      customerPhone: currentLeadState.data.phone,
      customerAddress: currentLeadState.data.address,
      whatsappUrl: whatsappLink,
      isFinalized: true,
    },
  };
}
