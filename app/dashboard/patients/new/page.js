"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewPatient() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", age: "", gender: "", address: "", complaint: "" });
  const [saving, setSaving] = useState(false);

  function handle(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit() {
    if (!form.name) { alert("Name is required"); return; }
    setSaving(true);
    await fetch("/api/patients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    router.push("/dashboard/patients");
  }

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard/patients" className="text-blue-200 text-sm">← Back</Link>
        <h1 className="text-white font-extrabold text-lg">👤 New Patient</h1>
      </div>
      <div className="max-w-xl mx-auto px-4 py-4 space-y-3">
        {[
          { label: "Name *", name: "name" },
          { label: "Phone", name: "phone", type: "tel" },
          { label: "Age", name: "age", type: "number" },
          { label: "Address", name: "address" },
          { label: "Complaint", name: "complaint" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
            <input type={f.type || "text"} name={f.name} value={form[f.name]} onChange={handle} className={inp} />
          </div>
        ))}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
          <select name="gender" value={form.gender} onChange={handle} className={inp}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button onClick={handleSubmit} disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-lg disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}