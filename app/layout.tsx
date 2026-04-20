import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Cauz | Full Stack Developer",
  description: "A handcrafted developer portfolio for Cauz, focused on apps, bots, and automation systems.",
  metadataBase: new URL("https://cauz.dev"),
  openGraph: {
    title: "Cauz | Full Stack Developer",
    description: "Apps, bots, and automation systems built with care.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Cauz | Full Stack Developer",
    description: "Apps, bots, and automation systems built with care."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
