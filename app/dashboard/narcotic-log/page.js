export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { narcoticLog } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function NarcoticLogPage() {
  await requireAccess();
  const logs = await db.select().from(narcoticLog).orderBy(desc(narcoticLog.createdAt));

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-blue-200 text-sm">← Back</Link>
        <h1 className="text-white font-extrabold text-lg">📋 Narcotic Log</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {logs.length === 0 ? (
          <div className="text-center text-gray-400 py-20">कोई entry नहीं है</div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-800">{log.medicineName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    log.transactionType === "sale"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}>
                    {log.transactionType === "sale" ? "Sale" : "Purchase"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>Schedule: <span className="font-semibold text-orange-600">{log.scheduleType}</span> &nbsp;|&nbsp; Qty: <span className="font-semibold">{log.qty}</span></p>
                  {log.patientName && <p>Patient: {log.patientName} {log.patientPhone && `| ${log.patientPhone}`}</p>}
                  {log.doctorName && <p>Doctor: {log.doctorName}</p>}
                  {log.prescriptionNo && <p>Rx No: {log.prescriptionNo}</p>}
                  {log.remarks && <p>Remarks: {log.remarks}</p>}
                  <p className="text-gray-400">{new Date(log.createdAt).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}