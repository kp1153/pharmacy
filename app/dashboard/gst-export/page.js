"use client";
import { useState } from "react";

export default function GstExportPage() {
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [month, setMonth] = useState(defaultMonth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/gst-export?month=${month}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  function downloadCSV() {
    if (!data) return;
    const headers = ["Bill No", "Date", "Patient", "Phone", "Taxable", "Discount", "GST", "Net Amount", "Payment"];
    const rows = data.sales.map(s => [
      s.billNo, s.date, s.patientName, s.patientPhone,
      s.subtotal.toFixed(2), s.discount.toFixed(2),
      s.gstAmount.toFixed(2), s.netAmount.toFixed(2), s.paymentType
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GST_${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="pt-4">
      <h1 className="text-xl font-bold text-gray-800 mb-1">GST Export</h1>
      <p className="text-sm text-gray-500 mb-5">Monthly sales data for GSTR-1 / GSTR-3B</p>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-5 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Select Month</label>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <button onClick={load} disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 transition">
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total Bills", value: data.summary.count, color: "text-blue-700" },
              { label: "Taxable Amount", value: "₹" + data.summary.totalTaxable.toFixed(0), color: "text-gray-700" },
              { label: "GST Collected", value: "₹" + data.summary.totalGst.toFixed(0), color: "text-indigo-700" },
              { label: "Net Sales", value: "₹" + data.summary.totalNet.toFixed(0), color: "text-green-700" },
            ].map(c => (
              <div key={c.label} className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className={`text-xl font-extrabold ${c.color}`}>{c.value}</p>
                <p className="text-xs text-gray-500 mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          <button onClick={downloadCSV}
            className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-green-700 transition mb-5">
            Download CSV for {month}
          </button>

          {data.sales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {["Bill No", "Date", "Patient", "Taxable", "GST", "Net", "Payment"].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-gray-600 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.sales.map((s, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2">{s.billNo}</td>
                      <td className="px-3 py-2">{s.date}</td>
                      <td className="px-3 py-2">{s.patientName || "—"}</td>
                      <td className="px-3 py-2">₹{(s.subtotal - s.discount).toFixed(0)}</td>
                      <td className="px-3 py-2">₹{s.gstAmount.toFixed(0)}</td>
                      <td className="px-3 py-2 font-semibold">₹{s.netAmount.toFixed(0)}</td>
                      <td className="px-3 py-2">{s.paymentType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center mt-10 text-gray-400">
              <p>No sales in {month}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}