"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function EditMedicinePage({ params }) {
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [form, setForm] = useState({
    name: "", generic: "", company: "", batch: "", expiry: "",
    mrp: "", purchasePrice: "", stock: "", unit: "strip",
    rack: "", hsn: "", gst: "12", reorderLevel: "10",
    barcode: "", scheduleType: "general",
  });

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      const res = await fetch(`/api/medicines/${id}`);
      const data = await res.json();
      if (data) setForm({
        name: data.name || "",
        generic: data.generic || "",
        company: data.company || "",
        batch: data.batch || "",
        expiry: data.expiry || "",
        mrp: data.mrp || "",
        purchasePrice: data.purchasePrice || "",
        stock: data.stock || "",
        unit: data.unit || "strip",
        rack: data.rack || "",
        hsn: data.hsn || "",
        gst: data.gst || "12",
        reorderLevel: data.reorderLevel || "10",
        barcode: data.barcode || "",
        scheduleType: data.scheduleType || "general",
      });
    };
    load();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.mrp) return alert("Name और MRP जरूरी है");
    const { id } = await params;
    const res = await fetch(`/api/medicines/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/dashboard/medicines");
    else alert("Error updating medicine");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {showScanner && (
        <BarcodeScanner
          onScan={(code) => setForm({ ...form, barcode: code })}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="text-white text-xl">←</button>
        <h1 className="text-white font-bold text-lg">Edit Medicine</h1>
      </div>

      <div className="px-4 py-4 space-y-3 max-w-lg mx-auto">

        <input name="name" placeholder="Medicine Name *" value={form.name}
          onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />

        <input name="generic" placeholder="Generic Name" value={form.generic}
          onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />

        <input name="company" placeholder="Company" value={form.company}
          onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" />

        <div className="flex gap-2">
          <input name="barcode" placeholder="Barcode" value={form.barcode}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <button onClick={() => setShowScanner(true)}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold">
            📷 Scan
          </button>
        </div>

        <select name="scheduleType" value={form.scheduleType}
          onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
          <option value="general">General</option>
          <option value="H">Schedule H</option>
          <option value="H1">Schedule H1</option>
          <option value="X">Schedule X (Narcotic)</option>
        </select>

        <div className="flex gap-2">
          <input name="batch" placeholder="Batch" value={form.batch}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <input name="expiry" placeholder="Expiry (MM/YY)" value={form.expiry}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="flex gap-2">
          <input name="mrp" type="number" placeholder="MRP *" value={form.mrp}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <input name="purchasePrice" type="number" placeholder="Purchase Price" value={form.purchasePrice}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="flex gap-2">
          <input name="stock" type="number" placeholder="Stock" value={form.stock}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <select name="unit" value={form.unit}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm">
            <option value="strip">Strip</option>
            <option value="bottle">Bottle</option>
            <option value="tube">Tube</option>
            <option value="box">Box</option>
            <option value="vial">Vial</option>
            <option value="sachet">Sachet</option>
          </select>
        </div>

        <div className="flex gap-2">
          <input name="rack" placeholder="Rack" value={form.rack}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <input name="hsn" placeholder="HSN Code" value={form.hsn}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
        </div>

        <div className="flex gap-2">
          <input name="gst" type="number" placeholder="GST %" value={form.gst}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <input name="reorderLevel" type="number" placeholder="Reorder Level" value={form.reorderLevel}
            onChange={handleChange} className="flex-1 border rounded-lg px-3 py-2 text-sm" />
        </div>

        <button onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm mt-2">
          Update Medicine
        </button>
      </div>
    </div>
  );
}