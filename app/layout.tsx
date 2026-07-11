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
        <link
          rel="preload"
          href="/videos/ucsdxcrs-v4.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body className="antialiased">
        <PageTheme />
        {children}
      </body>
    </html>
  );
}
