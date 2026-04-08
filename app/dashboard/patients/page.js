export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { patients } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function PatientsPage() {
  await requireAccess();
  const all = await db.select().from(patients).orderBy(desc(patients.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-blue-200 text-sm">← वापस</Link>
          <h1 className="text-white font-extrabold text-lg">👤 मरीज़</h1>
        </div>
        <Link href="/dashboard/patients/new" className="bg-white text-blue-700 font-bold text-sm px-3 py-1.5 rounded-lg">+ जोड़ो</Link>
      </div>
      <div className="px-4 py-4 space-y-3">
        {all.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
            <div className="font-bold text-gray-800 text-base">{p.name}</div>
            <div className="text-sm text-gray-500">{p.phone || "—"} · {p.age ? p.age + " साल" : ""} {p.gender || ""}</div>
            {p.complaint && <div className="text-sm text-gray-400 mt-1">{p.complaint}</div>}
          </div>
        ))}
        {all.length === 0 && <p className="text-center text-gray-400 py-10">कोई मरीज़ नहीं</p>}
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