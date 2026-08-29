import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import FloatingChatWidget from "./components/FloatingChatWidget";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ogawash — Full-Service Laundry & Dry Cleaning",
  description:
    "Every order, tagged, sorted, sent to the right hands. Experience premium concierge laundry and dry cleaning handled end-to-end by Sage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable} scroll-smooth`}
    >
      <body className="bg-ink text-ivory antialiased min-h-screen selection:bg-sage selection:text-ink">
        {children}
        <FloatingChatWidget />
      </body>
    </html>
  );
}
