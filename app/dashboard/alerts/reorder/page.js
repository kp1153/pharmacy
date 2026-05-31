export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";

export default async function ReorderAlertPage() {
  await requireAccess();

  const outOfStock = await db
    .select()
    .from(medicines)
    .where(sql`stock = 0`)
    .orderBy(sql`name asc`);

  const lowStock = await db
    .select()
    .from(medicines)
    .where(sql`stock > 0 AND stock <= reorder_level`)
    .orderBy(sql`stock asc`);

  const Section = ({ title, items, color }) => items.length === 0 ? null : (
    <div className="mb-5">
      <p className={`text-sm font-bold mb-2 ${color}`}>{title} ({items.length})</p>
      <div className="flex flex-col gap-2">
        {items.map(m => (
          <Link key={m.id} href={`/dashboard/medicines/${m.id}/edit`}
            className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white active:scale-95 transition hover:border-blue-300"
          >
            <div>
              <p className="font-semibold text-sm text-gray-800">{m.name}</p>
              <p className="text-xs text-gray-400">{m.company || ""} · Rack: {m.rack || "—"}</p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className={`text-sm font-bold ${color}`}>Stock: {m.stock}</p>
              <p className="text-xs text-gray-400">Reorder at: {m.reorderLevel}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pt-4">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Reorder Alerts</h1>
      <p className="text-sm text-gray-500 mb-5">Medicines low on stock</p>

      <Section title="Out of Stock" items={outOfStock} color="text-red-600" />
      <Section title="Low Stock" items={lowStock} color="text-orange-600" />

      {outOfStock.length === 0 && lowStock.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          <div className="text-4xl mb-2">✅</div>
          <p>All stock levels OK</p>
        </div>
      )}
    </div>
  );
}