import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { Viewport } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog App",
  description: "A place where you can share your thoughts",
  keywords: [
    "blog",
    "talk about anything",
    "sharing of thoughts",
    "expressing opinion",
  ],
  openGraph: {
    title: "Blog App",
    description: "A place where you can share your thoughts",
    siteName: "Blog App",
    url: "", // add!!!
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={geistMono.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
