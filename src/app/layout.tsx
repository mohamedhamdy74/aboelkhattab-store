import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "أبو الخطاب للعطور",
  description: "المتجر الرسمي لمنتجات أبو الخطاب للعطور وبخور",
  icons: {
    icon: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
