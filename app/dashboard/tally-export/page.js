"use client";
import { useState } from "react";

export default function TallyExportPage() {
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [month, setMonth] = useState(defaultMonth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/tally-export?month=${month}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  function downloadCSV(rows, filename) {
    const headers = ["Type", "Date", "Ref No", "Party", "Amount", "GST", "Payment"];
    const csv = [headers, ...rows.map(r => [
      r.type, r.date, r.refNo, r.party,
      r.amount.toFixed(2), r.gst.toFixed(2), r.paymentType
    ])].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    if (!data) return;
    downloadCSV([...data.sales, ...data.purchases], `Tally_${month}.csv`);
  }

  return (
    <div className="pt-4">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Tally Export</h1>
      <p className="text-sm text-gray-500 mb-5">Monthly data for accountant / Tally import</p>

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
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Total Sales", value: "₹" + data.summary.totalSales.toFixed(0), color: "text-green-700" },
              { label: "Total Purchases", value: "₹" + data.summary.totalPurchases.toFixed(0), color: "text-red-700" },
              { label: "GST Collected", value: "₹" + data.summary.totalGst.toFixed(0), color: "text-indigo-700" },
            ].map(c => (
              <div key={c.label} className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className={`text-lg font-extrabold ${c.color}`}>{c.value}</p>
                <p className="text-xs text-gray-500 mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          <button onClick={downloadAll}
            className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-green-700 transition mb-5">
            Download All as CSV ({month})
          </button>

          <div className="flex gap-2 mb-5">
            <button onClick={() => downloadCSV(data.sales, `Sales_${month}.csv`)}
              className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition">
              Sales Only CSV
            </button>
            <button onClick={() => downloadCSV(data.purchases, `Purchases_${month}.csv`)}
              className="flex-1 bg-purple-50 border border-purple-200 text-purple-700 py-2 rounded-xl text-sm font-semibold hover:bg-purple-100 transition">
              Purchases Only CSV
            </button>
          </div>

          {data.sales.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-bold text-gray-700 mb-2">Sales ({data.sales.length})</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {["Date", "Bill No", "Party", "Amount", "GST", "Payment"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-gray-600 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.sales.map((s, i) => (
                      <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2">{s.date}</td>
                        <td className="px-3 py-2">{s.refNo}</td>
                        <td className="px-3 py-2">{s.party || "—"}</td>
                        <td className="px-3 py-2 font-semibold">₹{s.amount.toFixed(0)}</td>
                        <td className="px-3 py-2">₹{s.gst.toFixed(0)}</td>
                        <td className="px-3 py-2">{s.paymentType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.purchases.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-bold text-gray-700 mb-2">Purchases ({data.purchases.length})</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      {["Date", "Invoice", "Supplier", "Amount", "Status"].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-gray-600 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.purchases.map((p, i) => (
                      <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2">{p.date}</td>
                        <td className="px-3 py-2">{p.refNo || "—"}</td>
                        <td className="px-3 py-2">{p.party || "—"}</td>
                        <td className="px-3 py-2 font-semibold">₹{p.amount.toFixed(0)}</td>
                        <td className="px-3 py-2">{p.paymentType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.sales.length === 0 && data.purchases.length === 0 && (
            <div className="text-center mt-10 text-gray-400">
              <p>No data for {month}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}