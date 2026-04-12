export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { sales } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function SalesPage() {
  await requireAccess();
  const all = await db.select().from(sales).orderBy(desc(sales.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-blue-200 text-sm">← Back</Link>
          <h1 className="text-white font-extrabold text-lg">🧾 Sales</h1>
        </div>
        <Link href="/dashboard/sales/new" className="bg-white text-blue-700 font-bold text-sm px-3 py-1.5 rounded-lg">+ New Bill</Link>
      </div>
      <div className="px-4 py-4">
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="text-left px-4 py-3">Bill No</th>
                <th className="text-left px-4 py-3">Patient</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Payment</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {all.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.billNo}</td>
                  <td className="px-4 py-3 text-gray-800">{s.patientName || "—"}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-800">₹{s.netAmount}</td>
                  <td className="px-4 py-3 text-gray-500">{s.paymentType}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{s.createdAt?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/sales/${s.id}`} className="text-blue-600 text-xs font-bold">View</Link>
                  </td>
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