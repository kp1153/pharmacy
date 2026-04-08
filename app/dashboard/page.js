export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { medicines, sales, patients, purchases } from "@/lib/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";

export default async function Dashboard() {
  await requireAccess();

  const [medCount] = await db.select({ count: sql`count(*)` }).from(medicines);
  const [patCount] = await db.select({ count: sql`count(*)` }).from(patients);
  const [saleCount] = await db.select({ count: sql`count(*)` }).from(sales);
  const [purchaseCount] = await db.select({ count: sql`count(*)` }).from(purchases);

  const today = new Date().toISOString().split("T")[0];
  const [todaySales] = await db
    .select({ total: sql`coalesce(sum(net_amount), 0)` })
    .from(sales)
    .where(sql`date(created_at) = ${today}`);

  const thirtyDays = new Date();
  thirtyDays.setDate(thirtyDays.getDate() + 30);
  const [expiryCount] = await db
    .select({ count: sql`count(*)` })
    .from(medicines)
    .where(sql`expiry <= ${thirtyDays.toISOString().split("T")[0]} AND stock > 0`);

  const cards = [
    { label: "दवाइयाँ", value: medCount.count, icon: "💊", href: "/dashboard/medicines", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { label: "मरीज़", value: patCount.count, icon: "👤", href: "/dashboard/patients", color: "bg-green-50 border-green-200 text-green-700" },
    { label: "बिक्री", value: saleCount.count, icon: "🧾", href: "/dashboard/sales", color: "bg-amber-50 border-amber-200 text-amber-700" },
    { label: "खरीद", value: purchaseCount.count, icon: "📦", href: "/dashboard/purchases", color: "bg-purple-50 border-purple-200 text-purple-700" },
    { label: "आज की बिक्री", value: "₹" + Number(todaySales.total).toFixed(0), icon: "💰", href: "/dashboard/sales", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "एक्सपायरी अलर्ट", value: expiryCount.count, icon: "⚠️", href: "/dashboard/medicines", color: "bg-red-50 border-red-200 text-red-700" },
  ];

  const quickLinks = [
    { label: "नया बिल", icon: "🧾", href: "/dashboard/sales/new" },
    { label: "दवाई जोड़ो", icon: "💊", href: "/dashboard/medicines/new" },
    { label: "मरीज़ जोड़ो", icon: "👤", href: "/dashboard/patients/new" },
    { label: "खरीद जोड़ो", icon: "📦", href: "/dashboard/purchases/new" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-extrabold text-xl">💊 फार्मा प्रो</h1>
          <p className="text-blue-200 text-sm">डैशबोर्ड</p>
        </div>
        <a href="/api/auth/logout" className="text-blue-200 text-sm border border-blue-400 px-3 py-1.5 rounded-lg">लॉगआउट</a>
      </div>

      <div className="px-4 py-4">
        <h2 className="text-base font-bold text-gray-700 mb-3">त्वरित कार्य</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {quickLinks.map((q) => (
            <Link key={q.href} href={q.href} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 text-center font-bold text-sm transition active:scale-95">
              <div className="text-2xl mb-1">{q.icon}</div>
              {q.label}
            </Link>
          ))}
        </div>

        <h2 className="text-base font-bold text-gray-700 mb-3">सारांश</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cards.map((c) => (
            <Link key={c.href + c.label} href={c.href} className={`border rounded-xl p-4 ${c.color} transition active:scale-95`}>
              <div className="text-2xl mb-1">{c.icon}</div>
              <div className="text-2xl font-extrabold">{c.value}</div>
              <div className="text-sm font-semibold mt-1">{c.label}</div>
            </Link>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-50">
        {[
          { label: "होम", icon: "🏠", href: "/dashboard" },
          { label: "दवाइयाँ", icon: "💊", href: "/dashboard/medicines" },
          { label: "बिल", icon: "🧾", href: "/dashboard/sales" },
          { label: "मरीज़", icon: "👤", href: "/dashboard/patients" },
          { label: "सेटिंग", icon: "⚙️", href: "/dashboard/settings" },
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