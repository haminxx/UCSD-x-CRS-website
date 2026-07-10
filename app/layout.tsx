import type { Metadata } from "next";
import { PageTheme } from "@/components/page-theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "UCSD x CRS",
  description: "UCSD x CRS — official website.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Warm the hero poster + video so first paint / autoplay start faster */}
        <link rel="preload" as="image" href="/images/hero-poster.jpg" />
        <link
          rel="preload"
          as="video"
          href="/videos/ucsdxcrs-v2-mobile.mp4"
          type="video/mp4"
          media="(max-width: 767px)"
        />
        <link
          rel="preload"
          as="video"
          href="/videos/ucsdxcrs-v2.mp4"
          type="video/mp4"
          media="(min-width: 768px)"
        />
      </head>
      <body className="antialiased">
        <PageTheme />
        {children}
      </body>
    </html>
  );
}
