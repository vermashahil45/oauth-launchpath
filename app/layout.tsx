import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launchpath — OAuth setup, without the guesswork",
  description: "Evidence-backed OAuth setup guides. Know the work, the wait, and your next step.",
  icons: {
    icon: "/launchpath.svg",
    shortcut: "/launchpath.svg",
  },
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
