export const dynamic = "force-dynamic";
import "./globals.css";
import { Inter } from "next/font/google";
import { getSession } from "@/lib/session";
import TopBar from "@/components/TopBar";
import PWAInstall from "@/components/PWAInstall";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nishant Pharma Pro",
  description: "Smart Pharmacy Billing by Nishant Softwares",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Pharma Pro",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon_128.png" />
        <link rel="apple-touch-icon" sizes="256x256" href="/icon_256.png" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <PWAInstall />
        {session ? (
          <>
            <TopBar name={session.name} />
            <main className="max-w-5xl mx-auto px-4 pt-16 pb-8">
              {children}
            </main>
          </>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
