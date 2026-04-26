export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { sales, saleItems, pharmacySettings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import PrintButton from "./PrintButton";
import WhatsAppButton from "./WhatsAppButton";

export default async function ReceiptPage({ params }) {
  await requireAccess();
  const { id } = await params;

  const saleResult = await db.select().from(sales).where(eq(sales.id, Number(id))).limit(1);
  const sale = saleResult[0];
  if (!sale) return <div className="p-8 text-center text-gray-400">Bill not found</div>;

  const items = await db.select().from(saleItems).where(eq(saleItems.saleId, Number(id)));

  const settingsResult = await db.select().from(clinicSettings).limit(1);
  const s = settingsResult[0] || {};

  const totalGST = items.reduce((sum, item) => {
    const base = item.amount / (1 + (item.gst || 0) / 100);
    return sum + (item.amount - base);
  }, 0);

  const taxableAmount = items.reduce((sum, item) => {
    return sum + item.amount / (1 + (item.gst || 0) / 100);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/sales" className="text-blue-200 text-sm">← Back</Link>
          <h1 className="text-white font-extrabold text-lg">🧾 Receipt</h1>
        </div>
        <div className="flex gap-2">
          <PrintButton />
          {sale.patientPhone && (
            <WhatsAppButton
              phone={sale.patientPhone}
              billNo={sale.billNo}
              patientName={sale.patientName}
              netAmount={sale.netAmount}
              items={items}
              shopName={s.clinicName || "Medical Store"}
            />
          )}
        </div>
      </div>

      <div id="receipt" className="max-w-md mx-auto bg-white mt-4 rounded-xl shadow-sm p-6 print:shadow-none print:mt-0 print:rounded-none">

        <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-extrabold text-gray-900">{s.clinicName || "Medical Store"}</h2>
          {s.tagline && <p className="text-xs text-gray-500 mt-0.5">{s.tagline}</p>}
          {s.address && <p className="text-xs text-gray-500 mt-1">{s.address}{s.city ? ", " + s.city : ""}{s.state ? ", " + s.state : ""}</p>}
          {s.phone && <p className="text-xs text-gray-500">📞 {s.phone}</p>}
          {s.gstin && <p className="text-xs text-gray-500">GSTIN: {s.gstin}</p>}
          {s.dlNo && <p className="text-xs text-gray-500">DL No: {s.dlNo}</p>}
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <div>
            <p className="font-bold text-gray-700 text-sm">{sale.patientName || "—"}</p>
            {sale.patientPhone && <p>{sale.patientPhone}</p>}
          </div>
          <div className="text-right">
            <p className="font-mono text-xs text-gray-400">{sale.billNo}</p>
            <p>{sale.createdAt?.slice(0, 10)}</p>
            <p className={`font-bold mt-0.5 ${sale.paymentType === "Credit" ? "text-red-500" : "text-green-600"}`}>
              {sale.paymentType === "Cash" ? "Cash" : sale.paymentType === "UPI" ? "UPI" : "Credit"}
            </p>
          </div>
        </div>

        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500">
              <th className="text-left py-1">Medicine</th>
              <th className="text-center py-1">Qty</th>
              <th className="text-right py-1">MRP</th>
              <th className="text-right py-1">GST%</th>
              <th className="text-right py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-2">
                  <p className="font-semibold text-gray-800 text-sm leading-tight">{item.medicineName}</p>
                  {item.batch && <p className="text-xs text-gray-400">Batch: {item.batch}</p>}
                  {item.expiry && <p className="text-xs text-gray-400">Exp: {item.expiry}</p>}
                </td>
                <td className="text-center py-2 text-gray-700">{item.qty}</td>
                <td className="text-right py-2 text-gray-700">₹{item.mrp}</td>
                <td className="text-right py-2 text-gray-500">{item.gst || 0}%</td>
                <td className="text-right py-2 font-semibold text-gray-900">₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-dashed border-gray-300 pt-3 space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>₹{sale.subtotal}</span>
          </div>
          {sale.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>- ₹{sale.discount}</span>
            </div>
          )}
          {s.gstin && (
            <>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Taxable Amount</span>
                <span>₹{taxableAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>GST</span>
                <span>₹{totalGST.toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between font-extrabold text-lg text-gray-900 border-t border-gray-200 pt-2 mt-1">
            <span>Total</span>
            <span>₹{sale.netAmount}</span>
          </div>
          {sale.paymentType === "Credit" && (
            <div className="flex justify-between text-sm text-red-500 font-semibold">
              <span>Due</span>
              <span>₹{sale.netAmount}</span>
            </div>
          )}
        </div>

        <div className="text-center mt-4 pt-3 border-t border-dashed border-gray-200">
          <p className="text-xs text-gray-400">Thank you! Take medicines as prescribed by doctor.</p>
          {s.ownerName && <p className="text-xs text-gray-400 mt-1">{s.ownerName}</p>}
        </div>
      </div>
    </div>
  );
}