export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function MedicinesPage() {
  await requireAccess();
  const all = await db.select().from(medicines).orderBy(desc(medicines.createdAt));
  const today = new Date().toISOString().split("T")[0];
  const thirty = new Date();
  thirty.setDate(thirty.getDate() + 30);
  const thirtyStr = thirty.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-blue-200 text-sm">← वापस</Link>
          <h1 className="text-white font-extrabold text-lg">💊 दवाइयाँ</h1>
        </div>
        <Link href="/dashboard/medicines/new" className="bg-white text-blue-700 font-bold text-sm px-3 py-1.5 rounded-lg">+ जोड़ो</Link>
      </div>
      <div className="px-4 py-4">
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="text-left px-4 py-3">नाम</th>
                <th className="text-left px-4 py-3">बैच</th>
                <th className="text-left px-4 py-3">एक्सपायरी</th>
                <th className="text-right px-4 py-3">स्टॉक</th>
                <th className="text-right px-4 py-3">एमआरपी</th>
              </tr>
            </thead>
            <tbody>
              {all.map((m, i) => {
                const expired = m.expiry && m.expiry < today;
                const nearExpiry = m.expiry && m.expiry <= thirtyStr && !expired;
                return (
                  <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-gray-800">{m.name}</td>
                    <td className="px-4 py-3 text-gray-500">{m.batch || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={expired ? "text-red-600 font-bold" : nearExpiry ? "text-amber-600 font-bold" : "text-gray-500"}>
                        {m.expiry || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-800">{m.stock}</td>
                    <td className="px-4 py-3 text-right text-gray-700">₹{m.mrp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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