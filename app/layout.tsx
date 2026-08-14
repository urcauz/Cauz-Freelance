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
  title: "Cauz | Developer and Electrical Engineering Student",
  description: "pfftttt click on it to view ig >''<",
  metadataBase: new URL("https://cauz.is-a.dev"),
  openGraph: {
    title: "Cauz | Developer and Electrical Engineering Student",
    description: "pfftttt click on it to view ig >''<",
    type: "website",
    images: [
      {
        url: "https://i.ibb.co/4RM4G8cD/cauzsfjasdhkashgajkshgjaks.jpg",
        width: 1200,
        height: 630,
        alt: "Cauz — developer and electrical engineering student"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cauz | Developer and Electrical Engineering Student",
    description: "pfftttt click on it to view ig >''<",
    images: ["https://i.ibb.co/4RM4G8cD/cauzsfjasdhkashgajkshgjaks.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
