import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
  title: "निशांत फार्मा प्रो",
  description: "Smart Clinic Management by Nishant Softwares",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased" style={{ fontFamily: "Inter, sans-serif" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}