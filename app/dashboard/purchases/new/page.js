"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPurchase() {
  const router = useRouter();
  const [supplierName, setSupplierName] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [items, setItems] = useState([{ medicineName: "", batch: "", expiry: "", qty: "", purchasePrice: "", mrp: "", gst: "12", amount: "" }]);
  const [saving, setSaving] = useState(false);

  function updateItem(i, key, val) {
    const updated = [...items];
    updated[i][key] = val;
    if (key === "qty" || key === "purchasePrice") {
      const qty = parseFloat(updated[i].qty) || 0;
      const pp = parseFloat(updated[i].purchasePrice) || 0;
      updated[i].amount = (qty * pp).toFixed(2);
    }
    setItems(updated);
  }

  function addRow() { setItems([...items, { medicineName: "", batch: "", expiry: "", qty: "", purchasePrice: "", mrp: "", gst: "12", amount: "" }]); }
  function removeRow(i) { setItems(items.filter((_, idx) => idx !== i)); }

  const totalAmount = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);

  async function handleSubmit() {
    const validItems = items.filter(it => it.medicineName && it.qty);
    if (!validItems.length) { alert("At least one medicine is required"); return; }
    setSaving(true);
    await fetch("/api/purchases", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ supplierName, invoiceNo, items: validItems, totalAmount }) });
    router.push("/dashboard/purchases");
  }

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard/purchases" className="text-blue-200 text-sm">← Back</Link>
        <h1 className="text-white font-extrabold text-lg">📦 New Purchase</h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">Supplier Info</h2>
          <input type="text" placeholder="Supplier Name" value={supplierName} onChange={e => setSupplierName(e.target.value)} className={inp} />
          <input type="text" placeholder="Invoice Number" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className={inp} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">Medicines</h2>
          {items.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <input type="text" placeholder="Medicine Name *" value={item.medicineName} onChange={e => updateItem(i, "medicineName", e.target.value)} className={inp} />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Batch" value={item.batch} onChange={e => updateItem(i, "batch", e.target.value)} className={inp} />
                <input type="text" placeholder="Expiry" value={item.expiry} onChange={e => updateItem(i, "expiry", e.target.value)} className={inp} />
                <input type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(i, "qty", e.target.value)} className={inp} />
                <input type="number" placeholder="Purchase Price" value={item.purchasePrice} onChange={e => updateItem(i, "purchasePrice", e.target.value)} className={inp} />
                <input type="number" placeholder="MRP" value={item.mrp} onChange={e => updateItem(i, "mrp", e.target.value)} className={inp} />
                <input type="text" readOnly value={"₹" + (item.amount || 0)} className={inp + " bg-gray-50"} />
              </div>
              {items.length > 1 && <button onClick={() => removeRow(i)} className="text-red-500 text-sm font-medium">Remove</button>}
            </div>
          ))}
          <button onClick={addRow} className="w-full border-2 border-dashed border-blue-300 text-blue-600 font-bold py-2 rounded-xl">+ Add Medicine</button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between font-extrabold text-lg text-gray-800">
          <span>Total</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>

        <button onClick={handleSubmit} disabled={saving} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl disabled:opacity-50">
          {saving ? "Saving..." : "Save Purchase"}
        </button>
      </div>
    </div>
  );
}