import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="id" className={cn("h-full", "antialiased", fraunces.variable, jakarta.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
