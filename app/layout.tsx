import type { Metadata } from "next";
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
    <html lang="en">
      <head>
        <script src="https://kit.fontawesome.com/e39a93544f.js" crossOrigin="anonymous"></script>
      </head>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
