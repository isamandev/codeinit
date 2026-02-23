import type { Metadata } from "next";
import { vazirmatnFD } from "@/fonts/vazirmatn/vazirmatn";
import "./globals.css";
import { Header, Footer } from "@/shared/ui";
import SWRProvider from "@/shared/lib/swr/SWRProvider";

export const metadata: Metadata = {
  title: "کد اینیت",
  description: "همه‌ چیز از یه شروع درست آغاز می‌شه",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatnFD.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <SWRProvider>
          <Header />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
            {children}
          </main>
          <Footer />
        </SWRProvider>
      </body>
    </html>
  );
}
