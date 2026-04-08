"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewSale() {
  const router = useRouter();
  const [medicines, setMedicines] = useState([]);
  const [patient, setPatient] = useState({ name: "", phone: "" });
  const [items, setItems] = useState([{ medicineId: "", medicineName: "", batch: "", expiry: "", mrp: "", qty: 1, gst: 12, amount: 0 }]);
  const [paymentType, setPaymentType] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/medicines").then(r => r.json()).then(setMedicines);
  }, []);

  function selectMed(index, medId) {
    const med = medicines.find(m => String(m.id) === String(medId));
    if (!med) return;
    const updated = [...items];
    updated[index] = { ...updated[index], medicineId: med.id, medicineName: med.name, batch: med.batch || "", expiry: med.expiry || "", mrp: med.mrp, gst: med.gst || 12, amount: med.mrp * updated[index].qty };
    setItems(updated);
  }

  function updateQty(index, qty) {
    const updated = [...items];
    updated[index].qty = parseInt(qty) || 1;
    updated[index].amount = updated[index].mrp * updated[index].qty;
    setItems(updated);
  }

  function addRow() { setItems([...items, { medicineId: "", medicineName: "", batch: "", expiry: "", mrp: "", qty: 1, gst: 12, amount: 0 }]); }
  function removeRow(i) { setItems(items.filter((_, idx) => idx !== i)); }

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const netAmount = Math.max(0, subtotal - parseFloat(discount || 0));

  async function handleSubmit() {
    if (!patient.name) { alert("मरीज़ का नाम ज़रूरी है"); return; }
    const validItems = items.filter(it => it.medicineId && it.qty > 0);
    if (!validItems.length) { alert("कम से कम एक दवाई चुनो"); return; }
    setSaving(true);
    await fetch("/api/sales", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ patient, items: validItems, subtotal, discount: parseFloat(discount || 0), netAmount, paymentType }) });
    router.push("/dashboard/sales");
  }

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard/sales" className="text-blue-200 text-sm">← वापस</Link>
        <h1 className="text-white font-extrabold text-lg">🧾 नया बिल</h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">मरीज़ की जानकारी</h2>
          <input type="text" placeholder="नाम *" value={patient.name} onChange={e => setPatient({ ...patient, name: e.target.value })} className={inp} />
          <input type="tel" placeholder="फोन" value={patient.phone} onChange={e => setPatient({ ...patient, phone: e.target.value })} className={inp} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">दवाइयाँ</h2>
          {items.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <select value={item.medicineId} onChange={e => selectMed(i, e.target.value)} className={inp}>
                <option value="">दवाई चुनो</option>
                {medicines.map(m => <option key={m.id} value={m.id}>{m.name} (स्टॉक: {m.stock})</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500">मात्रा</label>
                  <input type="number" min="1" value={item.qty} onChange={e => updateQty(i, e.target.value)} className={inp} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">रकम</label>
                  <input type="text" readOnly value={"₹" + (item.amount || 0)} className={inp + " bg-gray-50"} />
                </div>
              </div>
              {items.length > 1 && <button onClick={() => removeRow(i)} className="text-red-500 text-sm">हटाओ</button>}
            </div>
          ))}
          <button onClick={addRow} className="w-full border-2 border-dashed border-blue-300 text-blue-600 font-bold py-2 rounded-xl">+ दवाई जोड़ो</button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">भुगतान</h2>
          <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className={inp}>
            <option value="Cash">नकद</option>
            <option value="UPI">यूपीआई</option>
            <option value="Credit">उधार</option>
          </select>
          <div>
            <label className="text-xs text-gray-500">छूट (₹)</label>
            <input type="number" min="0" value={discount} onChange={e => setDiscount(e.target.value)} className={inp} />
          </div>
          <div className="flex justify-between font-extrabold text-lg text-gray-800 border-t pt-3">
            <span>कुल</span>
            <span>₹{netAmount.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={saving} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl disabled:opacity-50">
          {saving ? "सेव हो रहा है..." : "बिल बनाओ"}
        </button>
      </div>
    </div>
  );
}