import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoChat",
  description: "업무 알림을 한 곳에서, AI가 요약해드립니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
