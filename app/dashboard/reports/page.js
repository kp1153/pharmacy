export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { sales, saleItems } from "@/lib/schema";
import { sql, desc } from "drizzle-orm";
import Link from "next/link";

export default async function ReportsPage() {
  await requireAccess();

  const allSales = await db.select().from(sales).orderBy(desc(sales.createdAt));

  const monthlyMap = {};
  allSales.forEach((s) => {
    const month = s.createdAt?.slice(0, 7);
    if (!month) return;
    if (!monthlyMap[month]) monthlyMap[month] = { total: 0, cash: 0, upi: 0, credit: 0, count: 0 };
    monthlyMap[month].total += s.netAmount || 0;
    monthlyMap[month].count += 1;
    if (s.paymentType === "Cash") monthlyMap[month].cash += s.netAmount || 0;
    else if (s.paymentType === "UPI") monthlyMap[month].upi += s.netAmount || 0;
    else if (s.paymentType === "Credit") monthlyMap[month].credit += s.netAmount || 0;
  });

  const months = Object.keys(monthlyMap).sort().reverse();

  const today = new Date().toISOString().split("T")[0];
  const todaySales = allSales.filter((s) => s.createdAt?.slice(0, 10) === today);
  const todayTotal = todaySales.reduce((sum, s) => sum + (s.netAmount || 0), 0);

  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthData = monthlyMap[thisMonth] || { total: 0, count: 0, cash: 0, upi: 0, credit: 0 };

  const totalCredit = allSales
    .filter((s) => s.paymentType === "Credit")
    .reduce((sum, s) => sum + (s.netAmount || 0), 0);

  const topItems = await db
    .select({
      medicineName: saleItems.medicineName,
      totalQty: sql`sum(${saleItems.qty})`,
      totalAmount: sql`sum(${saleItems.amount})`,
    })
    .from(saleItems)
    .groupBy(saleItems.medicineName)
    .orderBy(sql`sum(${saleItems.amount}) desc`)
    .limit(10);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-blue-200 text-sm">← Back</Link>
        <h1 className="text-white font-extrabold text-lg">📊 Reports</h1>
      </div>

      <div className="px-4 py-4 space-y-5">

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-emerald-700">₹{todayTotal.toFixed(0)}</p>
            <p className="text-xs text-emerald-600 mt-1">Today's Sales</p>
            <p className="text-xs text-emerald-500">{todaySales.length} bills</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-blue-700">₹{thisMonthData.total.toFixed(0)}</p>
            <p className="text-xs text-blue-600 mt-1">This Month</p>
            <p className="text-xs text-blue-500">{thisMonthData.count} bills</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-red-600">₹{totalCredit.toFixed(0)}</p>
            <p className="text-xs text-red-500 mt-1">Total Credit Due</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-purple-700">{allSales.length}</p>
            <p className="text-xs text-purple-600 mt-1">Total Bills</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700">Monthly Summary</h2>
          </div>
          {months.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">No data yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {months.map((month) => {
                const d = monthlyMap[month];
                return (
                  <div key={month} className="px-4 py-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-gray-800 text-sm">{month}</span>
                      <span className="font-extrabold text-blue-700">₹{d.total.toFixed(0)}</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-gray-500">{d.count} bills</span>
                      <span className="text-green-600">Cash: ₹{d.cash.toFixed(0)}</span>
                      <span className="text-purple-600">UPI: ₹{d.upi.toFixed(0)}</span>
                      <span className="text-red-500">Credit: ₹{d.credit.toFixed(0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700">Top 10 Medicines by Sales</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {topItems.map((item, i) => (
              <div key={i} className="px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.medicineName}</p>
                  <p className="text-xs text-gray-400">Qty sold: {item.totalQty}</p>
                </div>
                <p className="font-bold text-blue-700">₹{Number(item.totalAmount).toFixed(0)}</p>
              </div>
            ))}
          </div>
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