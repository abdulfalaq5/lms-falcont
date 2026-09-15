import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LMS Belajar",
  description: "Platform Learning Management System untuk kelas online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
