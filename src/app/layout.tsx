import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeTutor - Free Tutor Pairing Platform",
  description: "Connect students with special needs to qualified volunteer tutors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
