import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { BRAND } from "@/constants";

// =============================================
// FONT CONFIGURATION
// =============================================

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// =============================================
// SEO METADATA
// =============================================

export const metadata: Metadata = {
  metadataBase: new URL("https://pushpagiricoffee.com"),
  title: {
    default: "Pushpagiri Coffee & Spice | Premium Organic Coffee & Spices from Coorg",
    template: "%s | Pushpagiri Coffee & Spice",
  },
  description:
    "Buy premium organic coffee and authentic spices directly from Pushpagiri estate in Choudlu, Coorg, Karnataka. Arabica, Robusta, Filter Coffee, Black Pepper, Cardamom, Cloves & more.",
  keywords: [
    "Coorg coffee",
    "organic coffee India",
    "Arabica coffee Karnataka",
    "Pushpagiri coffee",
    "Coorg spices",
    "black pepper Coorg",
    "cardamom Karnataka",
    "filter coffee powder",
    "buy coffee online India",
    "premium spices online",
  ],
  authors: [{ name: "Pushpagiri Coffee & Spice" }],
  creator: "Pushpagiri Coffee & Spice",
  publisher: "Pushpagiri Coffee & Spice",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://pushpagiricoffee.com",
    title: "Pushpagiri Coffee & Spice | Premium Organic from Coorg",
    description:
      "Premium organic coffee and authentic spices from the misty hills of Coorg, Karnataka.",
    siteName: "Pushpagiri Coffee & Spice",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pushpagiri Coffee & Spice - Premium Organic from Coorg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pushpagiri Coffee & Spice | Premium Organic from Coorg",
    description:
      "Premium organic coffee and spices from the misty hills of Coorg.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // TODO: Add Google Search Console verification token
    google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  },
};

// =============================================
// ROOT LAYOUT
// =============================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-inter bg-brand-cream antialiased">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* WhatsApp Float Button */}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
