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
    text: "Hello! I'm Sage, your Ogawash concierge. Whether you need a doorstep pickup, dry cleaning for delicate garments, or rush same-day service, I can arrange everything right here.",
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
      text: "Yes, I am Sage, Ogawash's AI concierge! I handle conversational intake, tag your care requirements, and schedule your pickups in real-time. Once your items are collected, our master human dry cleaners and garment specialists handle the physical washing and pressing.",
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
      text: `I can arrange a courier to your location today. I've drafted a pickup ticket for your review. What address and estimated bag count shall I log?`,
      timestamp: timeStr,
      ticket: {
        id: `#OG-${randomTicketNum}`,
        service: "Concierge Pickup & Delivery",
        timing: "Today, Window 5:00 PM – 7:00 PM",
        items: "Awaiting garment count & address",
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
      text: "Our standard Wash & Fold is returned crisp within 24 hours ($2.25/lb). Dry cleaning takes 48 hours for delicate garment treatments. For emergencies, our Express Same-Day service gets your items back by 6:00 PM when submitted before 10:00 AM.",
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
      text: "Express Same-Day is prioritized directly into our express thermal washers and steam presses. Orders placed by 10:00 AM are ready for delivery or collection by 6:00 PM the same day.",
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
      text: "We specialize in delicate fabrics. Every silk blouse, cashmere knit, and tailored suit is inspected, tested for colorfastness, and treated with eco-friendly solvents and custom moisture-controlled steam pressing.",
      timestamp: timeStr,
    };
  }

  // Default warm concierge response
  return {
    id: `msg-${Date.now()}`,
    sender: "sage",
    text: `Got it! I've noted: "${userMessage}". Would you like me to create a service ticket for pickup, or do you have any specific fabric care requirements?`,
    timestamp: timeStr,
  };
}
