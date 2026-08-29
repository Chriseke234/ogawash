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
  ownerWhatsappUrl?: string;
  customerWhatsappUrl?: string;
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
    ownerWhatsappUrl?: string;
    customerWhatsappUrl?: string;
    isFinalized?: boolean;
    trackingStatus?: string;
    stageProgress?: number;
  };
}

export const OWNER_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "2349030375493";

export const SAGE_QUICK_PROMPTS = [
  "Explain Wash & Fold",
  "Explain Dry Cleaning",
  "Explain Same-Day Express",
  "Book a pickup for today",
];

export const SAGE_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    sender: "sage",
    text: "Hello! I am Sage, your Ogawash laundry assistant. I can explain our laundry and dry cleaning services, calculate pricing, or book your doorstep pickup in 60 seconds. What service would you like to know more about?",
    timestamp: "Just now",
  },
];

/**
 * Strips all forms of asterisks to ensure messages look human and natural.
 */
export function sanitizeSageText(text: string): string {
  return text.replace(/\*/g, "").trim();
}

/**
 * Normalizes phone numbers to standard WhatsApp format.
 * Handles Nigerian local numbers (e.g. 08012345678 -> 2348012345678) and international formats.
 */
export function normalizeWhatsAppPhone(phone?: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (!cleaned) return "";

  // If Nigerian local format starting with 0 (11 digits: e.g. 08031234567, 09030375493)
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `234${cleaned.slice(1)}`;
  }

  // If 10 digits without leading zero (e.g. 8031234567)
  if (cleaned.length === 10) {
    return `234${cleaned}`;
  }

  return cleaned;
}

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
 * Builds the direct WhatsApp click-to-chat URL for the business owner with pre-formatted dispatch details
 */
export function formatOwnerWhatsAppUrl(lead: LeadData): string {
  const cleanOwnerPhone = OWNER_WHATSAPP_NUMBER.replace(/\D/g, "");
  const orderMessage = [
    "NEW OGAWASH LAUNDRY DISPATCH",
    "-----------------------------",
    `Order Ticket: ${lead.ticketId || "#OG-" + Math.floor(1000 + Math.random() * 9000)}`,
    `Customer Name: ${lead.name || "Valued Customer"}`,
    `Phone Number: ${lead.phone || "Not provided"}`,
    `Service Requested: ${lead.service || "Standard Laundry"}`,
    `Pickup Address: ${lead.address || "Pending confirmation"}`,
    `Preferred Pickup Time: ${lead.timing || "As soon as possible"}`,
    lead.notes ? `Special Instructions: ${lead.notes}` : "",
    "-----------------------------",
    "Generated automatically by Sage Ogawash Assistant",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${cleanOwnerPhone}?text=${encodeURIComponent(orderMessage)}`;
}

/**
 * Builds the direct WhatsApp click-to-chat URL for the customer with their order confirmation and receipt
 */
export function formatCustomerWhatsAppUrl(lead: LeadData): string {
  const customerPhone = normalizeWhatsAppPhone(lead.phone);
  const confirmationMessage = [
    "OGAWASH LAUNDRY BOOKING CONFIRMATION",
    "-----------------------------",
    `Hello ${lead.name || "there"}! Here is your official Ogawash pickup receipt:`,
    "",
    `Ticket ID: ${lead.ticketId || "#OG-" + Math.floor(1000 + Math.random() * 9000)}`,
    `Service: ${lead.service || "Standard Laundry"}`,
    `Pickup Address: ${lead.address || "Pending confirmation"}`,
    `Scheduled Time: ${lead.timing || "As soon as possible"}`,
    "Status: Confirmed & Dispatched",
    "",
    "Our rider will contact you prior to arrival. Need help? Call or WhatsApp our dispatch desk at +234 903 037 5493.",
    "-----------------------------",
    "Thank you for choosing Ogawash!",
  ]
    .filter(Boolean)
    .join("\n");

  if (customerPhone) {
    return `https://wa.me/${customerPhone}?text=${encodeURIComponent(confirmationMessage)}`;
  }
  // Fallback to general WhatsApp share if phone not yet provided
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(confirmationMessage)}`;
}

/**
 * Backward compatibility alias for owner URL
 */
export function formatWhatsAppOrderUrl(lead: LeadData): string {
  return formatOwnerWhatsAppUrl(lead);
}

// Conversation Session State for Lead Closing & Tracking
let currentLeadState: {
  step: "idle" | "awaiting_confirmation" | "awaiting_tracking_input" | "awaiting_name" | "awaiting_phone" | "awaiting_address" | "awaiting_timing" | "closed";
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
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Initialize ticket ID if not set
  if (!currentLeadState.data.ticketId) {
    currentLeadState.data.ticketId = `#OG-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // A. TRACKING / ACCOUNT CHECK INTENT
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    normalized.includes("track") ||
    normalized.includes("account") ||
    normalized.includes("where is my order") ||
    normalized.includes("order status") ||
    normalized.includes("check my order")
  ) {
    currentLeadState.step = "awaiting_tracking_input";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        "I can look up your order status right away. Please reply with your Order Ticket ID (such as #OG-5821) or the Phone Number you used when booking."
      ),
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // B. PROCESSING TRACKING INPUT
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentLeadState.step === "awaiting_tracking_input") {
    currentLeadState.step = "idle";
    const lookupKey = userMessage.trim();
    const cleanNumber = lookupKey.replace(/\D/g, "");
    const demoTicketId = lookupKey.startsWith("#") ? lookupKey : `#OG-${cleanNumber.slice(-4) || "8421"}`;

    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        `Found your account for ${lookupKey}. Here is your live order tracking status:`
      ),
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
  // C. PRE-BOOKING CONFIRMATION ("Yes", "Sure", "Book now", "Proceed")
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    currentLeadState.step === "awaiting_confirmation" &&
    (normalized.includes("yes") ||
      normalized.includes("sure") ||
      normalized.includes("book") ||
      normalized.includes("proceed") ||
      normalized.includes("ok") ||
      normalized.includes("yep") ||
      normalized.includes("start") ||
      normalized.includes("please") ||
      normalized.includes("now"))
  ) {
    currentLeadState.step = "awaiting_name";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        `Excellent. Let us book your ${currentLeadState.data.service || "doorstep pickup"}. To get your dispatch ticket ready, what is your full name?`
      ),
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // D. ACTIVE INTAKE FLOW (Steps 1 to 4)
  // ─────────────────────────────────────────────────────────────────────────────
  if (currentLeadState.step === "awaiting_name") {
    currentLeadState.data.name = userMessage.trim();
    currentLeadState.step = "awaiting_phone";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        `Nice to meet you, ${currentLeadState.data.name}. What is your Phone or WhatsApp number so our rider can contact you upon arrival?`
      ),
      timestamp: timeStr,
    };
  }

  if (currentLeadState.step === "awaiting_phone") {
    currentLeadState.data.phone = userMessage.trim();
    currentLeadState.step = "awaiting_address";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        "Got your number. Where should our dispatch rider pick up your laundry? Please enter your street address and area."
      ),
      timestamp: timeStr,
    };
  }

  if (currentLeadState.step === "awaiting_address") {
    currentLeadState.data.address = userMessage.trim();
    currentLeadState.step = "awaiting_timing";
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        "Perfect. What date and time window works best for your doorstep pickup? (For example: Today 5:00 PM, Tomorrow 9:00 AM, or ASAP)"
      ),
      timestamp: timeStr,
    };
  }

  if (currentLeadState.step === "awaiting_timing") {
    currentLeadState.data.timing = userMessage.trim();
    currentLeadState.data.isClosed = true;
    currentLeadState.step = "closed";

    const ownerWhatsappLink = formatOwnerWhatsAppUrl(currentLeadState.data);
    const customerWhatsappLink = formatCustomerWhatsAppUrl(currentLeadState.data);

    currentLeadState.data.whatsappUrl = ownerWhatsappLink;
    currentLeadState.data.ownerWhatsappUrl = ownerWhatsappLink;
    currentLeadState.data.customerWhatsappUrl = customerWhatsappLink;

    const customerName = currentLeadState.data.name || "valued customer";
    const serviceName = currentLeadState.data.service || "Doorstep Laundry";
    const address = currentLeadState.data.address || "your address";
    const timing = currentLeadState.data.timing || "scheduled time";

    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        `Thank you so much for choosing Ogawash, ${customerName}!\n\nYour ${serviceName} pickup is confirmed for ${timing} at ${address}.\n\nOur team has generated your dispatch ticket. Use the buttons below to send the order to our dispatch team on WhatsApp and receive a copy on your own WhatsApp number.`
      ),
      timestamp: timeStr,
      ticket: {
        id: currentLeadState.data.ticketId || "#OG-7721",
        service: currentLeadState.data.service || "Standard Laundry",
        timing: currentLeadState.data.timing || "Today",
        items: "Confirmed Order",
        customerName: currentLeadState.data.name,
        customerPhone: currentLeadState.data.phone,
        customerAddress: currentLeadState.data.address,
        whatsappUrl: ownerWhatsappLink,
        ownerWhatsappUrl: ownerWhatsappLink,
        customerWhatsappUrl: customerWhatsappLink,
        isFinalized: true,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // E. SERVICE EXPLANATION BEFORE BOOKING: WASH & FOLD
  // ─────────────────────────────────────────────────────────────────────────────
  if (normalized.includes("wash & fold") || normalized.includes("wash and fold") || normalized.includes("everyday")) {
    currentLeadState.data.service = "Wash & Fold (₦1,500/kg)";
    currentLeadState.step = "awaiting_confirmation";

    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        "Wash & Fold Service (From ₦1,500/kg):\n\nOur Wash & Fold is designed for everyday wardrobe care, t-shirts, trousers, towels, and bed linens.\n\n• Handling: Whites and colors are separated and washed in eco-friendly detergents at your preferred temperature.\n• Finishing: Dried with anti-wrinkle cycle and hand-folded neatly by garment type.\n• Packaging: Sealed in breathable protective covers.\n• Turnaround: Standard 24-hour delivery.\n\nWould you like me to book Wash & Fold for your pickup? Reply 'Yes' or 'Book now' to start."
      ),
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // F. SERVICE EXPLANATION BEFORE BOOKING: DRY CLEANING
  // ─────────────────────────────────────────────────────────────────────────────
  if (normalized.includes("dry clean") || normalized.includes("suit") || normalized.includes("gown") || normalized.includes("silk") || normalized.includes("blazer")) {
    currentLeadState.data.service = "Delicate Dry Cleaning";
    currentLeadState.step = "awaiting_confirmation";

    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        "Delicate Dry Cleaning (From ₦3,500/item):\n\nSpecialized care dedicated to suits, tailored blazers, evening gowns, silk dresses, cashmere knits, and delicate fabrics.\n\n• Handling: Master cleaners pre-inspect stains and treat fabrics with gentle solvent baths.\n• Finishing: Hand steam pressed with anti-static fabric conditioning.\n• Packaging: Placed on contoured hangers in breathable dust covers.\n• Turnaround: 48 hours for complete fabric treatment.\n\nWould you like me to book Dry Cleaning for your garments? Reply 'Yes' or 'Book now' to start."
      ),
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // G. SERVICE EXPLANATION BEFORE BOOKING: SAME-DAY EXPRESS
  // ─────────────────────────────────────────────────────────────────────────────
  if (normalized.includes("express") || normalized.includes("same day") || normalized.includes("rush") || normalized.includes("urgent")) {
    currentLeadState.data.service = "Express Same-Day Priority";
    currentLeadState.step = "awaiting_confirmation";

    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        "Same-Day Express Service:\n\nOur priority rush lane for emergencies and rapid turnaround.\n\n• Schedule: Orders booked and collected before 10:00 AM receive immediate processing in rapid washers.\n• Finishing: High-speed steam pressing and rapid packaging.\n• Delivery: Returned fresh and crisp to your doorstep by 6:00 PM the exact same day.\n\nWould you like me to book Same-Day Express for today? Reply 'Yes' or 'Book now' to start."
      ),
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // H. GENERAL BOOKING INTAKE TRIGGER ("Book us now", "Book a pickup", "Get started")
  // ─────────────────────────────────────────────────────────────────────────────
  if (
    normalized.includes("book us now") ||
    normalized.includes("book now") ||
    normalized.includes("book pickup") ||
    normalized.includes("book a pickup") ||
    normalized.includes("start an order") ||
    normalized.includes("get started")
  ) {
    currentLeadState.data.service = "Doorstep Laundry & Dry Cleaning";
    currentLeadState.step = "awaiting_name";

    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: sanitizeSageText(
        "Great! Let us book your doorstep laundry pickup in under 60 seconds.\n\nTo get your dispatch ticket ready, what is your full name?"
      ),
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // I. PRICING & TURNAROUND FAQ INTENT
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
      text: sanitizeSageText(
        "Here are our transparent rates:\n• Wash & Fold: ₦1,500/kg (24-hour turnaround)\n• Dry Cleaning: From ₦3,500/item (48-hour turnaround)\n• Same-Day Express: Ready by 6:00 PM when booked before 10:00 AM\n• Pickup & Delivery: Free on orders over ₦25,000\n\nWould you like me to explain any of these services or book your pickup now?"
      ),
      timestamp: timeStr,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // J. DEFAULT GENERAL CONVERSATION
  // ─────────────────────────────────────────────────────────────────────────────
  return {
    id: `msg-${Date.now()}`,
    sender: "sage",
    text: sanitizeSageText(
      "I am here to help. I can:\n• Explain our services (such as 'Explain Wash & Fold' or 'Explain Dry Cleaning')\n• Book a pickup (say 'Book Us Now')\n• Track an order (say 'Track order')\n\nWhat service would you like to explore?"
    ),
    timestamp: timeStr,
  };
}
