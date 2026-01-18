import type { Metadata } from "next";
import { AnimatePresence } from "framer-motion";
import "./globals.css";

export const metadata: Metadata = {
  title: "MatchedIn",
  description: "Expand your network with optimized LinkedIn connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script src="https://kit.fontawesome.com/e39a93544f.js" crossOrigin="anonymous"></script>
      </head>
      <body
        className={`antialiased`}
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </body>
    </html>
  );
}
