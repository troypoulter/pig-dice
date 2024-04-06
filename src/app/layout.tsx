import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PlausibleProvider from "next-plausible";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pig: The Ultimate Dice Duel",
  description:
    "Risk it all or play it safe in a game of strategy and luck - where every roll can lead to victory or defeat!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {process.env.NODE_ENV === "production" && (
          <PlausibleProvider
            domain="pig-dice.troypoulter.com"
            trackOutboundLinks
          />
        )}
      </head>
      <body className={inter.className}>
        <div className="h-full relative flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-100">
          <main className="h-full container">{children}</main>
        </div>
      </body>
    </html>
  );
}
