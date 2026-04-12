export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";
import Link from "next/link";
import MedicinesList from "./MedicinesList";

export default async function MedicinesPage() {
  await requireAccess();
  const all = await db.select().from(medicines).orderBy(medicines.name);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-blue-200 text-sm">← Back</Link>
          <h1 className="text-white font-extrabold text-lg">💊 Medicines</h1>
        </div>
        <Link href="/dashboard/medicines/new" className="bg-white text-blue-700 font-bold text-sm px-3 py-1.5 rounded-lg">+ Add</Link>
      </div>
      <MedicinesList medicines={all} />
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