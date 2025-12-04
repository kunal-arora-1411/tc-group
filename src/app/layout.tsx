import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IntentFlow - AI-Powered Outreach Intelligence",
  description: "Live intent signals to warm outreach in 20 seconds. Research accounts, detect buying signals, score intent, and generate personalized outreach — automatically.",
  keywords: ["sales intelligence", "intent data", "outreach automation", "AI sales", "B2B prospecting"],
  authors: [{ name: "IntentFlow" }],
  openGraph: {
    title: "IntentFlow - AI-Powered Outreach Intelligence",
    description: "Live intent signals to warm outreach in 20 seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
