"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/home", label: "Home", icon: "🏠" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/sales/new", label: "New Sale", icon: "🛒" },
  { href: "/dashboard/medicines", label: "Medicines", icon: "💊" },
  { href: "/dashboard/purchases", label: "Purchases", icon: "📦" },
  { href: "/dashboard/reports", label: "Reports", icon: "📈" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function TopBar({ name }) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-900 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center gap-1 px-3 py-2">

        {/* Mobile: Home + Logout only */}
        <div className="flex md:hidden items-center gap-1 w-full">
          <Link
            href="/home"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              pathname === "/home"
                ? "bg-white text-blue-900"
                : "text-blue-200 hover:bg-blue-800"
            }`}
          >
            <span>🏠</span>
            <span>Home</span>
          </Link>
          <div className="flex-1" />
          <button
            onClick={handleLogout}
            className="bg-transparent text-red-300 text-sm px-2 py-1.5 rounded-lg hover:bg-blue-800 transition"
          >
            🚪 Logout
          </button>
        </div>

        {/* PC: सब links */}
        <div className="hidden md:flex items-center gap-1 w-full">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/home" &&
                item.href !== "/dashboard" &&
                pathname.startsWith(item.href)) ||
              (item.href === "/dashboard" && pathname === "/dashboard");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  active
                    ? "bg-white text-blue-900"
                    : "text-blue-200 hover:bg-blue-800"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="flex-1" />
          <button
            onClick={handleLogout}
            className="bg-transparent text-red-300 text-sm px-2 py-1.5 rounded-lg hover:bg-blue-800 whitespace-nowrap transition"
          >
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  );
}