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
  };
}

export const SAGE_QUICK_PROMPTS = [
  "Book a pickup for today",
  "What are your turnaround times?",
  "Are you an AI or a real person?",
  "How does express same-day work?",
];

export const SAGE_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    sender: "sage",
    text: "Hello! I'm Sage, your Ogawash laundry assistant. Whether you need a doorstep pickup, dry cleaning for suits/delicate clothes, or rush same-day service, I can book your order right here.",
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
 * Intelligent client-side response generator for Sage
 * Embeds Sage's persona, honesty rules, and service routing.
 */
export async function getSageResponse(userMessage: string): Promise<ChatMessage> {
  const normalized = userMessage.toLowerCase().trim();
  const timeStr = "Just now";

  // Simulate subtle natural typing latency
  await new Promise((resolve) => setTimeout(resolve, 700));

  // Direct honesty rule regarding AI/bot identity
  if (
    normalized.includes("are you a bot") ||
    normalized.includes("are you an ai") ||
    normalized.includes("are you human") ||
    normalized.includes("are you real") ||
    normalized.includes("who are you") ||
    normalized.includes("who made you")
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "Yes, I am Sage, Ogawash's automated AI laundry assistant! I handle your bookings, note down any special wash instructions, and schedule pickups in real-time. Once collected, our professional human cleaners handle the physical washing and pressing.",
      timestamp: timeStr,
    };
  }

  // Wash & Fold booking
  if (normalized.includes("wash & fold") || normalized.includes("wash and fold") || normalized.includes("everyday")) {
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "Great choice! Our Wash & Fold is $2.25/lb, washed at your preferred temperature, dried, and crisply folded within 24 hours. What is your collection address and estimated bag count?",
      timestamp: timeStr,
      ticket: {
        id: `#OG-${randomTicketNum}`,
        service: "Wash & Fold Service",
        timing: "Ready within 24 Hours",
        items: "Awaiting pickup address",
      },
    };
  }

  // Dry cleaning booking
  if (normalized.includes("dry clean") || normalized.includes("suit") || normalized.includes("gown") || normalized.includes("silk")) {
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "I've noted Dry Cleaning for delicate garments/suits. Our master cleaners inspect every fabric and finish with hand steam pressing. Where should our courier pick them up?",
      timestamp: timeStr,
      ticket: {
        id: `#OG-${randomTicketNum}`,
        service: "Delicate Dry Cleaning",
        timing: "Ready within 48 Hours",
        items: "Suits / Delicate Garments",
      },
    };
  }

  // Express Same-Day booking
  if (normalized.includes("express") || normalized.includes("same day") || normalized.includes("rush")) {
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "Express Same-Day priority logged! Orders placed in the morning are washed, pressed, and returned to your doorstep by 6:00 PM today. Please send your address to dispatch the rider.",
      timestamp: timeStr,
      ticket: {
        id: `#OG-${randomTicketNum}`,
        service: "Express Same-Day Priority",
        timing: "Delivered by 6:00 PM Today",
        items: "Priority Express Dispatch",
      },
    };
  }

  // General Pickup scheduling query
  if (
    normalized.includes("pickup") ||
    normalized.includes("schedule") ||
    normalized.includes("book") ||
    normalized.includes("collect") ||
    normalized.includes("today") ||
    normalized.includes("start")
  ) {
    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: `I can arrange a rider to pick up your laundry today. I've created an order ticket below. What address and how many bags should I put down?`,
      timestamp: timeStr,
      ticket: {
        id: `#OG-${randomTicketNum}`,
        service: "Doorstep Pickup & Delivery",
        timing: "Today, Window 5:00 PM – 7:00 PM",
        items: "Awaiting bag count & address",
      },
    };
  }

  // Turnaround & Pricing query
  if (
    normalized.includes("turnaround") ||
    normalized.includes("how long") ||
    normalized.includes("price") ||
    normalized.includes("cost") ||
    normalized.includes("time")
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "Standard Wash & Fold is returned clean and folded within 24 hours ($2.25/lb). Dry cleaning takes 48 hours for special garment care. For emergencies, our Express Same-Day gets your clothes back by 6:00 PM when submitted before 10:00 AM.",
      timestamp: timeStr,
    };
  }

  // Default assistant response
  return {
    id: `msg-${Date.now()}`,
    sender: "sage",
    text: `Got it! I've noted: "${userMessage}". Would you like me to book a doorstep pickup for you, or do you have any specific wash instructions?`,
    timestamp: timeStr,
  };
}
