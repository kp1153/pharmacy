"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewMedicine() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", generic: "", company: "", batch: "", expiry: "", mrp: "", purchasePrice: "", stock: "", unit: "strip", rack: "", hsn: "", gst: "12" });
  const [saving, setSaving] = useState(false);

  function handle(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit() {
    if (!form.name || !form.mrp) { alert("Name and MRP required"); return; }
    setSaving(true);
    await fetch("/api/medicines", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    router.push("/dashboard/medicines");
  }

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard/medicines" className="text-blue-200 text-sm">← Back</Link>
        <h1 className="text-white font-extrabold text-lg">💊 New Medicine</h1>
      </div>
      <div className="max-w-xl mx-auto px-4 py-4 space-y-3">
        {[
          { label: "Medicine Name *", name: "name" },
          { label: "Generic Name", name: "generic" },
          { label: "Company", name: "company" },
          { label: "Batch No", name: "batch" },
          { label: "Expiry (YYYY-MM)", name: "expiry", placeholder: "2026-12" },
          { label: "MRP *", name: "mrp", type: "number" },
          { label: "Purchase Price", name: "purchasePrice", type: "number" },
          { label: "Stock", name: "stock", type: "number" },
          { label: "Rack", name: "rack" },
          { label: "HSN Code", name: "hsn" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
            <input type={f.type || "text"} name={f.name} value={form[f.name]} onChange={handle} placeholder={f.placeholder || ""} className={inp} />
          </div>
        ))}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">GST %</label>
          <select name="gst" value={form.gst} onChange={handle} className={inp}>
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
          </select>
        </div>
        <button onClick={handleSubmit} disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-lg disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}