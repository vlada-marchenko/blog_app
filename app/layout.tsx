import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { Viewport } from "next";
import Header from "@/components/Header/Header";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blog.",
  description: "A place where you can share your thoughts",
  keywords: [
    "blog",
    "talk about anything",
    "sharing of thoughts",
    "expressing opinion",
  ],
  openGraph: {
    title: "Blog.",
    description:
      "A developer-driven blog for sharing technical insights, architecture patterns, and practical guides across modern software engineering",
    siteName: "Blog App",
    url: "https://blog-app-five-ebon-74.vercel.app/",
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
    <html lang="en" className={inter.variable}>
      <body className={inter.variable}>
        <AuthProvider>
          <div className="layout-wrapper">
            <Header />
            {children}
          </div>
        </AuthProvider>
        <Toaster theme="dark" position="top-right" richColors />
      </body>
    </html>
  );
}
