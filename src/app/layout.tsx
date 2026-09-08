import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import Cursor from "@/components/Cursor";
import ContactPopup from "@/components/ContactPopup";
import MotionProviders from "@/components/MotionProviders";
import { ContactPopupProvider } from "@/lib/contact-popup-context";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://raiqen.ai"),
  title: "RAIQEN — Intelligence. Engineered for Business.",
  description:
    "RAIQEN builds AI-powered products, intelligent software, and automated systems for modern businesses.",
  keywords: [
    "RAIQEN",
    "AI products",
    "intelligent software",
    "AI agents",
    "business automation",
    "AI workflows",
    "software engineering",
    "SaaS",
    "digital experiences",
  ],
  applicationName: "RAIQEN",
  openGraph: {
    type: "website",
    url: "https://raiqen.ai",
    siteName: "RAIQEN",
    title: "RAIQEN — Intelligence. Engineered for Business.",
    description:
      "RAIQEN builds AI-powered products, intelligent software, and automated systems for modern businesses.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAIQEN — Intelligence. Engineered for Business.",
    description:
      "RAIQEN builds AI-powered products, intelligent software, and automated systems for modern businesses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${mono.variable}`}
    >
      <body className="bg-ink font-body text-fg antialiased">
        <a
          href="#work"
          className="sr-only z-[400] rounded-full bg-gold px-5 py-2 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <MotionProviders>
          <ContactPopupProvider>
            <Cursor />
            {children}
            <ContactPopup />
          </ContactPopupProvider>
        </MotionProviders>
      </body>
    </html>
  );
}
