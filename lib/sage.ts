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
 * Intelligent client-side / simulated response generator for Sage
 * Embeds Sage's persona, honesty rules, and service routing.
 */
export async function getSageResponse(userMessage: string): Promise<ChatMessage> {
  const normalized = userMessage.toLowerCase().trim();
  const timeStr = "Just now";

  // Simulate subtle natural typing latency
  await new Promise((resolve) => setTimeout(resolve, 800));

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

  // Pickup scheduling query
  if (
    normalized.includes("pickup") ||
    normalized.includes("schedule") ||
    normalized.includes("book") ||
    normalized.includes("collect") ||
    normalized.includes("today")
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

  // Express same-day service query
  if (
    normalized.includes("express") ||
    normalized.includes("same day") ||
    normalized.includes("rush") ||
    normalized.includes("fast") ||
    normalized.includes("urgent")
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "Express Same-Day is prioritized directly for rapid washing and pressing. Orders placed before 10:00 AM are ready for delivery or pickup by 6:00 PM the same day.",
      timestamp: timeStr,
    };
  }

  // Delicates / Specialty items
  if (
    normalized.includes("silk") ||
    normalized.includes("wool") ||
    normalized.includes("leather") ||
    normalized.includes("suit") ||
    normalized.includes("delicate") ||
    normalized.includes("bedding")
  ) {
    return {
      id: `msg-${Date.now()}`,
      sender: "sage",
      text: "We specialize in delicate fabrics like silks, suits, woolens, and heavy bedding. Everything is inspected and washed with fabric-safe solutions and hand steam pressing.",
      timestamp: timeStr,
    };
  }

  // Default warm assistant response
  return {
    id: `msg-${Date.now()}`,
    sender: "sage",
    text: `Got it! I've noted: "${userMessage}". Would you like me to book a doorstep pickup for you, or do you have any specific wash instructions?`,
    timestamp: timeStr,
  };
}
