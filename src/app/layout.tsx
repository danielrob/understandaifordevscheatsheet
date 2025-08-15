import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Understand AI for Devs - Cheat Sheet",
  description: "A comprehensive cheat sheet for developers to understand AI concepts, tools, and practices",
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
      </body>
    </html>
  );
}