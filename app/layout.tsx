import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aryavarta - Ancient Wisdom for Modern Times",
  description: "Weekly insights from ancient Indian wisdom, Vedas, and Upanishads to enrich your modern life. Discover the timeless teachings of Sanatan Dharma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
