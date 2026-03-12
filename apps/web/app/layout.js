import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "JavaScript Workspace",
  description: "Platform pembelajaran JavaScript berbasis monorepo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen">
          <header className="border-b border-slate-200/80 bg-[#fffdf8]/90 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 md:px-6">
              <Link href="/" className="text-sm font-medium tracking-tight text-slate-900">
                JavaScript Workspace
              </Link>
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
                  Home
                </Link>
                <Link
                  href="/racks"
                  className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  Rak v2
                </Link>
                <Link
                  href="/legacy"
                  className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  v1
                </Link>
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
