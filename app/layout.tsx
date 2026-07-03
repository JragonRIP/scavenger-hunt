import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  applicationName: "Scavenger Hunt",
  title: "Scavenger Hunt",
  description:
    "A fun photo scavenger hunt for kids - snap what you find and let our robot friend check it!",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Scavenger Hunt",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
