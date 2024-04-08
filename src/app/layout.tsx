import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PlausibleProvider from "next-plausible";
import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pig: The Ultimate Dice Duel",
  description:
    "Risk it all or play it safe in a game of strategy and luck - where every roll can lead to victory or defeat!",
  metadataBase: new URL("https://pig-dice.troypoulter.com"),
  authors: [
    {
      name: "Troy Poulter",
      url: "https://troypoulter.com",
    },
  ],
  creator: "Troy Poulter",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://pig-dice.troypoulter.com",
    title: "Pig: The Ultimate Dice Duel",
    description:
      "Risk it all or play it safe in a game of strategy and luck - where every roll can lead to victory or defeat!",
    siteName: "Pig: The Ultimate Dice Duel",
    images: [
      {
        url: `https://pig-dice.troypoulter.com/og.jpg`,
        width: 1200,
        height: 630,
        alt: "Pig: The Ultimate Dice Duel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pig: The Ultimate Dice Duel",
    description:
      "Risk it all or play it safe in a game of strategy and luck - where every roll can lead to victory or defeat!",
    images: [`https://pig-dice.troypoulter.com/og.jpg`],
    creator: "@troypoulterr",
  },
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
          <div className="h-[64px] fixed inset-y-0 w-full z-[49]">
            <Navbar />
          </div>
          <main className="flex-1 pt-[64px] h-full container relative my-4">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
