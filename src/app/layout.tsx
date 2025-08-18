import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Understand AI for Devs - Cheat Sheet",
  description: "A comprehensive cheat sheet for developers to understand AI concepts & tooling",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-content antialiased min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {children}
        {process.env.NODE_ENV === 'production' && 
         process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && 
         process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
