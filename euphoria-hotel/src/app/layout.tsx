import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hiltoneuphoriahotel.com"),
  title: {
    default: "Hilton Euphoria Hotel · Lagos' Premier Five-Star Deluxe Hotel",
    template: "%s · Hilton Euphoria Hotel",
  },
  description:
    "Welcome to Lagos' premier five-star deluxe hotel. Experience the perfect blend of elegance and comfort at Hilton Euphoria Hotel.",
  keywords: [
    "Hilton Euphoria Hotel",
    "Lagos hotel",
    "five star hotel Lagos",
    "luxury hotel Nigeria",
    "Egbeda hotel",
    "Gowon Estate hotel",
    "conference room Lagos",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://hiltoneuphoriahotel.com",
    siteName: "Hilton Euphoria Hotel",
    title: "Hilton Euphoria Hotel · Lagos' Premier Five-Star Deluxe Hotel",
    description:
      "Welcome to Lagos' premier five-star deluxe hotel. Experience the perfect blend of elegance and comfort.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hilton Euphoria Hotel",
    description: "Lagos' premier five-star deluxe hotel.",
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
