import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ambrelle Fragrance",
  description: "Where Fragrance Becomes Identity. A luxury perfumery capturing elegance and atmospheric aesthetics.",
  openGraph: {
    title: "Ambrelle Fragrance - Systematic Scent Logic",
    description: "Discover luxury perfumes designed with architectural precision and timeless ingredients.",
    type: "website",
    locale: "en_US",
    siteName: "Ambrelle",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambrelle Fragrance",
    description: "Where Fragrance Becomes Identity.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,0,0,24..1,1,1,24&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased bg-background text-foreground selection:bg-primary-container/30`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}

