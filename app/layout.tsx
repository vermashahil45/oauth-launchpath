import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launchpath — OAuth setup guides",
  description: "Provider registration, permissions, approval requirements, and setup notes for agent builders.",
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
