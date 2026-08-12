import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { Viewport } from "next";
import Header from "@/components/Header/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // 600 is what your snippet needs
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
    <html lang="en" className={inter.variable}>
      <body className={inter.variable}>
        <AuthProvider>
          <div className="layout-wrapper">
            <Header />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
