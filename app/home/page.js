import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const TILES = [
  { href: "/dashboard", icon: "📊", label: "Dashboard", desc: "Today's overview" },
  { href: "/dashboard/sales/new", icon: "🛒", label: "New Sale", desc: "Create a bill" },
  { href: "/dashboard/sales", icon: "🧾", label: "Sales", desc: "All bills" },
  { href: "/dashboard/medicines", icon: "💊", label: "Medicines", desc: "Stock & expiry" },
  { href: "/dashboard/purchases", icon: "📦", label: "Purchases", desc: "Supplier invoices" },
  { href: "/dashboard/promise-orders", icon: "📋", label: "Promise Orders", desc: "Pending orders" },
  { href: "/dashboard/narcotic-log", icon: "🔒", label: "Narcotic Log", desc: "Schedule H/H1" },
  { href: "/dashboard/bank-reconciliation", icon: "🏦", label: "Bank", desc: "Reconciliation" },
  { href: "/dashboard/reports", icon: "📈", label: "Reports", desc: "Sales & stock" },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings", desc: "Pharmacy profile" },
];

export default async function HomePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const displayName = session.name?.split(" ")[0] || "Admin";

  return (
    <div className="pt-4">
      <div className="mb-6">
        <p className="text-gray-500 text-sm">Welcome back,</p>
        <h1 className="text-2xl font-bold text-gray-800">{displayName}</h1>
        <span className="inline-block mt-1 text-xs font-semibold uppercase tracking-wide text-white bg-blue-600 px-2 py-0.5 rounded-full">
          Pharmacy
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TILES.map((tile) => (
          <a
            key={tile.href}
            href={tile.href}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-2 active:scale-95 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-blue-100 text-blue-700">
              {tile.icon}
            </div>
            <div>
              <p className="font-semibold text-sm text-blue-900">{tile.label}</p>
              <p className="text-xs text-gray-400">{tile.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}