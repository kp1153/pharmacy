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
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-blue-200 text-sm">← Back</Link>
          <h1 className="text-white font-extrabold text-lg">👤 Patients</h1>
        </div>
        <Link href="/dashboard/patients/new" className="bg-white text-blue-700 font-bold text-sm px-3 py-1.5 rounded-lg">+ Add</Link>
      </div>
      <div className="px-4 py-4 space-y-3">
        {all.map((p) => (
          <Link key={p.id} href={`/dashboard/patients/${p.id}`}
            className="block bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm active:scale-95 transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900 text-base">{p.name}</p>
                <p className="text-sm text-gray-500">{p.phone || "—"} · {p.age ? p.age + " yrs" : ""} {p.gender || ""}</p>
                {p.complaint && <p className="text-sm text-gray-400 mt-1">{p.complaint}</p>}
              </div>
              <span className="text-blue-500 text-xs font-bold mt-1">View →</span>
            </div>
          </Link>
        ))}
        {all.length === 0 && <p className="text-center text-gray-400 py-10">No patients found</p>}
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