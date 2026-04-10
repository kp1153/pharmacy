import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import PWAInstall from "@/components/PWAInstall";

export const metadata = {
  title: "निशांत फार्मा प्रो",
  description: "Smart Clinic Management by Nishant Softwares",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ClinicOS",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "निशांत फार्मा प्रो",
    description: "Smart Clinic Management by Nishant Softwares",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ClinicOS" />
        <link rel="apple-touch-icon" href="/icon_128.png" />
        <link rel="apple-touch-icon" sizes="256x256" href="/icon_256.png" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-TileImage" content="/icon_128.png" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased" style={{ fontFamily: "Inter, sans-serif" }}>
        <AuthProvider>{children}</AuthProvider>
        <PWAInstall />
      </body>
    </html>
  );
}