export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { patients, sales, saleItems } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function PatientDetailPage({ params }) {
  await requireAccess();
  const { id } = await params;

  const result = await db.select().from(patients).where(eq(patients.id, parseInt(id))).limit(1);
  const patient = result[0];
  if (!patient) return <div className="p-8 text-center text-gray-400">Patient not found</div>;

  const allSales = await db.select().from(sales)
    .where(eq(sales.patientPhone, patient.phone || ""))
    .orderBy(desc(sales.createdAt));

  const billsWithItems = await Promise.all(
    allSales.map(async (s) => {
      const items = await db.select().from(saleItems).where(eq(saleItems.saleId, s.id));
      return { ...s, items };
    })
  );

  const totalSpent = allSales.reduce((sum, s) => sum + (s.netAmount || 0), 0);
  const creditDue = allSales
    .filter((s) => s.paymentType === "Credit")
    .reduce((sum, s) => sum + (s.netAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/patients" className="text-blue-200 text-sm">← Back</Link>
          <h1 className="text-white font-extrabold text-lg">👤 {patient.name}</h1>
        </div>
        <Link href={`/dashboard/sales/new?phone=${patient.phone || ""}&name=${patient.name}`}
          className="bg-white text-blue-700 font-bold text-sm px-3 py-1.5 rounded-lg">
          🧾 New Bill
        </Link>
      </div>

      <div className="px-4 py-4 space-y-4">

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <h2 className="font-bold text-gray-700 text-sm mb-3">Patient Info</h2>
          <div className="space-y-1 text-sm text-gray-600">
            {patient.phone && <p>📞 {patient.phone}</p>}
            {patient.age && <p>🎂 {patient.age} yrs · {patient.gender || ""}</p>}
            {patient.address && <p>📍 {patient.address}</p>}
            {patient.complaint && <p>🩺 {patient.complaint}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
            <p className="text-xl font-extrabold text-blue-700">₹{totalSpent.toFixed(0)}</p>
            <p className="text-xs text-blue-500 mt-0.5">Total Spent</p>
          </div>
          <div className={`rounded-xl p-3 border text-center ${creditDue > 0 ? "bg-red-50 border-red-100" : "bg-green-50 border-green-100"}`}>
            <p className={`text-xl font-extrabold ${creditDue > 0 ? "text-red-600" : "text-green-600"}`}>₹{creditDue.toFixed(0)}</p>
            <p className={`text-xs mt-0.5 ${creditDue > 0 ? "text-red-400" : "text-green-500"}`}>Credit Due</p>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-gray-700 text-sm mb-3">Bill History ({billsWithItems.length})</h2>
          {billsWithItems.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">No bills found</p>
          ) : (
            <div className="space-y-3">
              {billsWithItems.map((bill) => (
                <div key={bill.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
                    <div>
                      <p className="font-mono text-xs text-gray-400">{bill.billNo}</p>
                      <p className="text-xs text-gray-400">{bill.createdAt?.slice(0, 10)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-gray-900">₹{bill.netAmount}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        bill.paymentType === "Credit" ? "bg-red-100 text-red-600" :
                        bill.paymentType === "UPI" ? "bg-purple-100 text-purple-600" :
                        "bg-green-100 text-green-600"
                      }`}>
                        {bill.paymentType}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-2 space-y-1">
                    {bill.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs text-gray-600">
                        <span>{item.medicineName} × {item.qty}</span>
                        <span>₹{item.amount}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-50 flex justify-end">
                    <Link href={`/dashboard/sales/${bill.id}`} className="text-xs text-blue-600 font-bold">
                      View Receipt →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}