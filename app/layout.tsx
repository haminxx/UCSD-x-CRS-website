import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UCSD x CRS",
  description: "UCSD x CRS — official website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
