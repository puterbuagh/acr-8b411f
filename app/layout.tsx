import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Felt — Live Poker GTO Assistant",
  description: "Real-time screen-reading GTO advisor for online poker. Reads the table, solves the spot, ships the play.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-body bg-background text-foreground antialiased overflow-hidden">
        <div className="flex h-screen w-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto relative">
            {/* Atmospheric felt texture overlay */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.15]" style={{
              backgroundImage: "radial-gradient(circle at 20% 10%, rgba(34, 197, 94, 0.08) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(234, 179, 8, 0.06) 0%, transparent 50%)",
            }} />
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04] mix-blend-overlay" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }} />
            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
