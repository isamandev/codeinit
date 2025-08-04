import type { Metadata } from "next";
import { vazirmatnFD } from "../../fonts/vazirmatn/vazirmatn";
import "../globals.css";

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
    <html lang="en">
      <body className={`${vazirmatnFD.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
