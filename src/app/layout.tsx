import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/main-header'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dev-interviews — real UK developer interview experiences",
  description:
    "A narrative-first directory of real UK developer interview experiences, told round by round.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     
      <body className="min-h-full flex flex-col">
        <div>
           <Header />
           {children} 
        </div>
      </body>
    </html>
  );
}
