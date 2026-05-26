import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  category: "Hotel",
  title: {
    default: "Hilton Euphoria Hotel | Luxury Hotel in Egbeda, Lagos",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Hilton Euphoria Hotel",
    "Lagos hotel",
    "five star hotel Lagos",
    "luxury hotel Nigeria",
    "Egbeda hotel",
    "Gowon Estate hotel",
    "conference room Lagos",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Hilton Euphoria Hotel | Luxury Hotel in Egbeda, Lagos",
    description: siteConfig.description,
    images: [
      {
        url: "/hotel-assets/hotel-aerial.jpg",
        width: 1200,
        height: 630,
        alt: "Aerial night view of Hilton Euphoria Hotel in Lagos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hilton Euphoria Hotel | Luxury Hotel in Egbeda, Lagos",
    description: siteConfig.description,
    images: ["/hotel-assets/hotel-aerial.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background font-sans text-foreground" suppressHydrationWarning>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
