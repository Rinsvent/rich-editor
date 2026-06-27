import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Messenger",
  description: "Modern messenger UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
