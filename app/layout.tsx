import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "San Diego Family Trip",
  description:
    "Explorá, votá y elegí las mejores experiencias para nuestro viaje a San Diego.",
  openGraph: {
    title: "San Diego Family Trip",
    description:
      "Explorá, votá y elegí las mejores experiencias para nuestro viaje a San Diego.",
    url: "https://san-diego-trip-coral.vercel.app",
    siteName: "San Diego Family Trip",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "San Diego Family Trip preview",
      },
    ],
    locale: "es_CR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "San Diego Family Trip",
    description:
      "Explorá, votá y elegí las mejores experiencias para nuestro viaje a San Diego.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
