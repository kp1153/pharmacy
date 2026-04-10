"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NAV = [
  { label: "होम", icon: "🏠", href: "/dashboard" },
  { label: "दवाइयाँ", icon: "💊", href: "/dashboard/medicines" },
  { label: "बिल", icon: "🧾", href: "/dashboard/sales" },
  { label: "मरीज़", icon: "👤", href: "/dashboard/patients" },
  { label: "सेटिंग", icon: "⚙️", href: "/dashboard/settings" },
];

function MedSearch({ index, item, medicines, onSelect }) {
  const [query, setQuery] = useState(item.medicineName || "");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = query.length >= 1
    ? medicines.filter(m => m.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
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
        placeholder="दवाई का नाम टाइप करो..."
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
              <div className="font-semibold text-gray-800 text-sm">{m.name}</div>
              <div className="text-xs text-gray-400">
                MRP ₹{m.mrp} &nbsp;|&nbsp; स्टॉक: {m.stock} &nbsp;|&nbsp; {m.batch || "—"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function NewSale() {
  const router = useRouter();
  const [medicines, setMedicines] = useState([]);
  const [patient, setPatient] = useState({ name: "", phone: "" });
  const [items, setItems] = useState([
    { medicineId: "", medicineName: "", batch: "", expiry: "", mrp: "", qty: 1, gst: 12, amount: 0 },
  ]);
  const [paymentType, setPaymentType] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/medicines")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMedicines(data); })
      .catch(() => {});
  }, []);

  function selectMed(index, med) {
    setItems(prev => {
      const updated = prev.map((it, i) =>
        i === index
          ? { ...it, medicineId: med.id, medicineName: med.name, batch: med.batch || "", expiry: med.expiry || "", mrp: med.mrp, gst: med.gst || 12, amount: parseFloat(med.mrp) * it.qty }
          : it
      );
      return updated;
    });
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
    setItems(prev => [...prev, { medicineId: "", medicineName: "", batch: "", expiry: "", mrp: "", qty: 1, gst: 12, amount: 0 }]);
  }

  function removeRow(i) {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  }

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const netAmount = Math.max(0, subtotal - parseFloat(discount || 0));

  async function handleSubmit() {
    if (!patient.name) { alert("मरीज़ का नाम ज़रूरी है"); return; }
    const validItems = items.filter(it => it.medicineId && it.qty > 0);
    if (!validItems.length) { alert("कम से कम एक दवाई चुनो"); return; }
    setSaving(true);
    await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patient, items: validItems, subtotal, discount: parseFloat(discount || 0), netAmount, paymentType }),
    });
    router.push("/dashboard/sales");
  }

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard/sales" className="text-blue-200 text-sm">← वापस</Link>
        <h1 className="text-white font-extrabold text-lg">🧾 नया बिल</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

        {/* Patient */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">मरीज़ की जानकारी</h2>
          <input type="text" placeholder="नाम *" value={patient.name} onChange={e => setPatient({ ...patient, name: e.target.value })} className={inp} />
          <input type="tel" placeholder="फोन" value={patient.phone} onChange={e => setPatient({ ...patient, phone: e.target.value })} className={inp} />
        </div>

        {/* Medicines */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="font-bold text-gray-700">दवाइयाँ</h2>

          {/* Table header — desktop only */}
          <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase px-1">
            <div className="col-span-5">दवाई</div>
            <div className="col-span-2">बैच</div>
            <div className="col-span-1">MRP</div>
            <div className="col-span-2">मात्रा</div>
            <div className="col-span-2">रकम</div>
          </div>

          {items.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50">
              {/* Medicine search */}
              <MedSearch index={i} item={item} medicines={medicines} onSelect={selectMed} />

              {/* Details row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <label className="text-xs text-gray-500">बैच</label>
                  <input type="text" readOnly value={item.batch} className={inp + " bg-white text-gray-500 text-sm"} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">एक्सपायरी</label>
                  <input type="text" readOnly value={item.expiry} className={inp + " bg-white text-gray-500 text-sm"} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">MRP (₹)</label>
                  <input type="text" readOnly value={item.mrp} className={inp + " bg-white text-gray-500 text-sm"} />
                </div>
                <div>
                  <label className="text-xs text-gray-500">मात्रा</label>
                  <input
                    type="number" min="1"
                    value={item.qty}
                    onChange={e => updateQty(i, e.target.value)}
                    className={inp + " text-sm"}
                  />
                </div>
              </div>

              {/* Amount + remove */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-gray-700">
                  रकम: <span className="text-blue-700 text-base">₹{(item.amount || 0).toFixed(2)}</span>
                </span>
                {items.length > 1 && (
                  <button onClick={() => removeRow(i)} className="text-red-500 text-sm font-medium">✕ हटाओ</button>
                )}
              </div>
            </div>
          ))}

          <button onClick={addRow} className="w-full border-2 border-dashed border-blue-300 text-blue-600 font-bold py-2 rounded-xl hover:bg-blue-50 transition">
            + दवाई जोड़ो
          </button>
        </div>

        {/* Payment */}
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
            <span>उप-कुल</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          {parseFloat(discount) > 0 && (
            <div className="flex justify-between text-sm text-green-600 font-semibold">
              <span>छूट</span>
              <span>- ₹{parseFloat(discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-extrabold text-xl text-blue-700 border-t pt-3">
            <span>कुल देय</span>
            <span>₹{netAmount.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl disabled:opacity-50 active:scale-95 transition"
        >
          {saving ? "सेव हो रहा है..." : "✅ बिल बनाओ"}
        </button>
      </div>

      {/* Bottom Nav */}
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