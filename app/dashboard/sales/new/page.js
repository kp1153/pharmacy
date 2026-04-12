"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BarcodeScanner from "@/components/BarcodeScanner";

const NAV = [
  { label: "Home", icon: "🏠", href: "/dashboard" },
  { label: "Medicines", icon: "💊", href: "/dashboard/medicines" },
  { label: "Bills", icon: "🧾", href: "/dashboard/sales" },
  { label: "Patients", icon: "👤", href: "/dashboard/patients" },
  { label: "Reports", icon: "📊", href: "/dashboard/reports" },
];

function MedSearch({ index, item, medicines, onSelect }) {
  const [query, setQuery] = useState(item.medicineName || "");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = query.length >= 1
    ? medicines.filter(m => m.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  const selectedMed = medicines.find(m => m.name === query);
  const substitutes = selectedMed && selectedMed.stock === 0 && selectedMed.generic
    ? medicines.filter(m =>
        m.id !== selectedMed.id &&
        m.generic &&
        m.generic.toLowerCase() === selectedMed.generic.toLowerCase() &&
        m.stock > 0
      ).slice(0, 3)
    : [];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function pick(med) {
    setQuery(med.name);
    setOpen(false);
    onSelect(index, med);
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        placeholder="Type medicine name..."
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-52 overflow-y-auto">
          {filtered.map(m => (
            <li
              key={m.id}
              onMouseDown={() => pick(m)}
              className="px-3 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0"
            >
              <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                {m.name}
                {m.stock === 0 && <span className="text-xs bg-red-100 text-red-600 px-1 rounded">Out of Stock</span>}
                {m.scheduleType && m.scheduleType !== "general" && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-1 rounded">{m.scheduleType}</span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                MRP ₹{m.mrp} &nbsp;|&nbsp; Stock: {m.stock} &nbsp;|&nbsp; {m.batch || "—"}
              </div>
            </li>
          ))}
        </ul>
      )}
      {substitutes.length > 0 && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Out of stock — Substitutes available:</p>
          {substitutes.map(s => (
            <button
              key={s.id}
              type="button"
              onMouseDown={() => pick(s)}
              className="block w-full text-left px-2 py-1 text-xs text-amber-800 hover:bg-amber-100 rounded"
            >
              {s.name} — ₹{s.mrp} | Stock: {s.stock}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewSale() {
  const router = useRouter();
  const [medicines, setMedicines] = useState([]);
  const [patient, setPatient] = useState({ name: "", phone: "" });
  const [items, setItems] = useState([
    { medicineId: "", medicineName: "", batch: "", expiry: "", mrp: "", qty: 1, gst: 12, amount: 0, scheduleType: "general" },
  ]);
  const [paymentType, setPaymentType] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [doctorName, setDoctorName] = useState("");
  const [prescriptionNo, setPrescriptionNo] = useState("");

  useEffect(() => {
    fetch("/api/medicines")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMedicines(data); })
      .catch(() => {});
  }, []);

  function selectMed(index, med) {
    setItems(prev =>
      prev.map((it, i) =>
        i === index
          ? {
              ...it,
              medicineId: med.id,
              medicineName: med.name,
              batch: med.batch || "",
              expiry: med.expiry || "",
              mrp: med.mrp,
              gst: med.gst || 12,
              amount: parseFloat(med.mrp) * it.qty,
              scheduleType: med.scheduleType || "general",
            }
          : it
      )
    );
  }

  function updateQty(index, qty) {
    setItems(prev =>
      prev.map((it, i) =>
        i === index
          ? { ...it, qty: parseInt(qty) || 1, amount: parseFloat(it.mrp || 0) * (parseInt(qty) || 1) }
          : it
      )
    );
  }

  function addRow() {
    setItems(prev => [...prev, { medicineId: "", medicineName: "", batch: "", expiry: "", mrp: "", qty: 1, gst: 12, amount: 0, scheduleType: "general" }]);
  }

  function removeRow(i) {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleBarcodeScan(code) {
    const res = await fetch(`/api/medicines?barcode=${code}`);
    const med = await res.json();
    if (med && med.id) {
      const emptyIdx = items.findIndex(it => !it.medicineId);
      if (emptyIdx !== -1) {
        selectMed(emptyIdx, med);
      } else {
        addRow();
        setTimeout(() => selectMed(items.length, med), 0);
      }
    } else {
      alert("Barcode से medicine नहीं मिली: " + code);
    }
    setShowScanner(false);
  }

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const netAmount = Math.max(0, subtotal - parseFloat(discount || 0));
  const hasNarcotic = items.some(it => it.scheduleType && it.scheduleType !== "general");

  async function handleSubmit() {
    if (!patient.name) { alert("Patient name is required"); return; }
    const validItems = items.filter(it => it.medicineId && it.qty > 0);
    if (!validItems.length) { alert("Select at least one medicine"); return; }
    if (hasNarcotic && !doctorName) { alert("Scheduled drug है — Doctor name जरूरी है"); return; }
    setSaving(true);
    const res = await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient,
        items: validItems,
        subtotal,
        discount: parseFloat(discount || 0),
        netAmount,
        paymentType,
        doctorName: doctorName || null,
        prescriptionNo: prescriptionNo || null,
      }),
    });
    const data = await res.json();
    router.push(`/dashboard/sales/${data.billId}`);
  }

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard/sales" className="text-blue-200 text-sm">← Back</Link>
        <h1 className="text-white font-extrabold text-lg">🧾 New Bill</h1>
        <button onClick={() => setShowScanner(true)}
          className="ml-auto bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
          📷 Scan
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">Patient Info</h2>
          <input type="text" placeholder="Name *" value={patient.name}
            onChange={e => setPatient({ ...patient, name: e.target.value })} className={inp} />
          <input type="tel" placeholder="Phone" value={patient.phone}
            onChange={e => setPatient({ ...patient, phone: e.target.value })} className={inp} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">Medicines</h2>

          {items.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50">
              <MedSearch index={i} item={item} medicines={medicines} onSelect={selectMed} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <label className="text-xs text-gray-500">Batch</label>
                  <input type="text" readOnly value={item.batch} className={inp + " bg-white text-gray-500 text-sm"} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Expiry</label>
                  <input type="text" readOnly value={item.expiry} className={inp + " bg-white text-gray-500 text-sm"} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">MRP (₹)</label>
                  <input type="text" readOnly value={item.mrp} className={inp + " bg-white text-gray-500 text-sm"} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Qty</label>
                  <input type="number" min="1" value={item.qty}
                    onChange={e => updateQty(i, e.target.value)} className={inp + " text-sm"} />
                </div>
              </div>
              {item.scheduleType && item.scheduleType !== "general" && (
                <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                  ⚠️ Schedule {item.scheduleType} Drug
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-gray-700">
                  Amount: <span className="text-blue-700 text-base">₹{(item.amount || 0).toFixed(2)}</span>
                </span>
                {items.length > 1 && (
                  <button onClick={() => removeRow(i)} className="text-red-500 text-sm font-medium">✕ Remove</button>
                )}
              </div>
            </div>
          ))}

          <button onClick={addRow} className="w-full border-2 border-dashed border-blue-300 text-blue-600 font-bold py-2 rounded-xl hover:bg-blue-50 transition">
            + Add Medicine
          </button>
        </div>

        {hasNarcotic && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
            <h2 className="font-bold text-red-700">⚠️ Scheduled Drug — Extra Details Required</h2>
            <input type="text" placeholder="Doctor Name *" value={doctorName}
              onChange={e => setDoctorName(e.target.value)} className={inp} />
            <input type="text" placeholder="Prescription No." value={prescriptionNo}
              onChange={e => setPrescriptionNo(e.target.value)} className={inp} />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">Payment</h2>
          <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className={inp}>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Credit">Credit</option>
          </select>
          <div>
            <label className="text-xs text-gray-500">Discount (₹)</label>
            <input type="number" min="0" value={discount}
              onChange={e => setDiscount(e.target.value)} className={inp} />
          </div>
          <div className="flex justify-between font-extrabold text-lg text-gray-800 border-t pt-3">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {parseFloat(discount) > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-semibold">
              <span>Discount</span>
              <span>- ₹{parseFloat(discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-extrabold text-xl text-blue-700 border-t pt-3">
            <span>Total</span>
            <span>₹{netAmount.toFixed(2)}</span>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={saving}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl disabled:opacity-50 active:scale-95 transition">
          {saving ? "Saving..." : "✅ Create Bill"}
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-50">
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-blue-600 text-xs font-medium">
            <span className="text-xl">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}