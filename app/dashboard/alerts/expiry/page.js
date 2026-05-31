export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { medicines } from "@/lib/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";

export default async function ExpiryAlertPage() {
  await requireAccess();

  const today = new Date().toISOString().split("T")[0];
  const thirty = new Date(); thirty.setDate(thirty.getDate() + 30);
  const sixty = new Date(); sixty.setDate(sixty.getDate() + 60);
  const thirtyStr = thirty.toISOString().split("T")[0];
  const sixtyStr = sixty.toISOString().split("T")[0];

  const meds = await db
    .select()
    .from(medicines)
    .where(sql`expiry <= ${sixtyStr} AND stock > 0`)
    .orderBy(sql`expiry asc`);

  const expired  = meds.filter(m => m.expiry < today);
  const within30 = meds.filter(m => m.expiry >= today && m.expiry <= thirtyStr);
  const within60 = meds.filter(m => m.expiry > thirtyStr);

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
              <p className="text-xs text-gray-400">{m.company || ""} · Batch: {m.batch || "—"}</p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className={`text-sm font-bold ${color}`}>{m.expiry}</p>
              <p className="text-xs text-gray-400">Stock: {m.stock} {m.unit}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pt-4">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Expiry Alerts</h1>
      <p className="text-sm text-gray-500 mb-5">Medicines expiring within 60 days</p>

      <Section title="Already Expired" items={expired} color="text-red-600" />
      <Section title="Expiring in 30 days" items={within30} color="text-orange-600" />
      <Section title="Expiring in 31-60 days" items={within60} color="text-amber-600" />

      {meds.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          <div className="text-4xl mb-2">✅</div>
          <p>No expiry alerts</p>
        </div>
      )}
    </div>
  );
}