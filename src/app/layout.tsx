import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeTutor - 免費補習義教配對平台",
  description: "連接有特殊需要的學生與合資格的義務導師",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body className="antialiased">{children}</body>
    </html>
  );
}
