export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { purchases } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function PurchasesPage() {
  await requireAccess();
  const all = await db.select().from(purchases).orderBy(desc(purchases.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-blue-200 text-sm">← Back</Link>
          <h1 className="text-white font-extrabold text-lg">📦 Purchases</h1>
        </div>
        <Link href="/dashboard/purchases/new" className="bg-white text-blue-700 font-bold text-sm px-3 py-1.5 rounded-lg">+ Add</Link>
      </div>
      <div className="px-4 py-4">
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="text-left px-4 py-3">Supplier</th>
                <th className="text-left px-4 py-3">Invoice</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {all.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 text-gray-800">{p.supplierName || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{p.invoiceNo || "—"}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-800">₹{p.totalAmount}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.createdAt?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-50">
        {[
          { label: "Home", icon: "🏠", href: "/dashboard" },
          { label: "Medicines", icon: "💊", href: "/dashboard/medicines" },
          { label: "Bills", icon: "🧾", href: "/dashboard/sales" },
          { label: "Patients", icon: "👤", href: "/dashboard/patients" },
          { label: "Reports", icon: "📊", href: "/dashboard/reports" },
        ].map((n) => (
          <Link key={n.href} href={n.href} className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-blue-600 text-xs font-medium">
            <span className="text-xl">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}