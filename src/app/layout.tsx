import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BSC Voting",
  description: "Voting Instance for the Bronyvision Songcontest 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer data-domain="bsc.quest-crusaders.de" src="https://plausible.wireway.ch/js/script.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
