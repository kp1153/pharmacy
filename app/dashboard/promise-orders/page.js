"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PromiseOrdersPage() {
  const [orders, setOrders] = useState([]);

  function load() {
    fetch("/api/promise-orders").then(r => r.json()).then(setOrders).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function markFulfilled(id) {
    await fetch(`/api/promise-orders?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "fulfilled" }),
    });
    load();
  }

  const pending = orders.filter(o => o.status === "pending");
  const fulfilled = orders.filter(o => o.status === "fulfilled");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-blue-200 text-sm">← Back</Link>
        <h1 className="text-white font-extrabold text-lg">📋 Promise Orders</h1>
        <span className="ml-auto bg-white text-blue-700 font-bold text-sm px-3 py-1 rounded-lg">
          {pending.length} Pending
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {pending.length === 0 && (
          <p className="text-center text-gray-400 py-10">कोई pending order नहीं</p>
        )}

        {pending.map(o => (
          <div key={o.id} className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-900">{o.medicineName}</p>
                <p className="text-sm text-gray-500">Qty: {o.qty}</p>
                <p className="text-sm text-gray-700 font-medium mt-1">{o.patientName}</p>
                {o.patientPhone && <p className="text-sm text-blue-600">{o.patientPhone}</p>}
              </div>
              <button
                onClick={() => markFulfilled(o.id)}
                className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg">
                ✅ Fulfilled
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">{o.createdAt?.slice(0, 16)}</p>
          </div>
        ))}

        {fulfilled.length > 0 && (
          <>
            <p className="text-xs text-gray-400 font-semibold pt-2">✅ Fulfilled</p>
            {fulfilled.map(o => (
              <div key={o.id} className="bg-white rounded-xl border border-green-100 p-4 opacity-60">
                <p className="font-semibold text-gray-700">{o.medicineName} — {o.patientName}</p>
                <p className="text-xs text-gray-400">{o.createdAt?.slice(0, 16)}</p>
              </div>
            ))}
          </>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-50">
        {[
          { label: "Home", icon: "🏠", href: "/dashboard" },
          { label: "Medicines", icon: "💊", href: "/dashboard/medicines" },
          { label: "Bills", icon: "🧾", href: "/dashboard/sales" },
          { label: "Patients", icon: "👤", href: "/dashboard/patients" },
          { label: "Reports", icon: "📊", href: "/dashboard/reports" },
        ].map(n => (
          <Link key={n.href} href={n.href} className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-blue-600 text-xs font-medium">
            <span className="text-xl">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}