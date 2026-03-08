import type { Metadata } from "next";
import { Space_Mono, Syncopate } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

const syncopate = Syncopate({
  weight: ['400', '700'],
  variable: "--font-syncopate",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ambrelle Fragrance",
  description: "Where Fragrance Becomes Identity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceMono.variable} ${syncopate.variable} antialiased bg-[#FAFAFA] text-[#2C143B] dark:bg-[#13091B] dark:text-[#F1E3FC] selection:bg-[#692484]/30`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

