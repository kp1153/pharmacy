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
    if (!form.name) { alert("नाम ज़रूरी है"); return; }
    setSaving(true);
    await fetch("/api/patients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    router.push("/dashboard/patients");
  }

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard/patients" className="text-blue-200 text-sm">← वापस</Link>
        <h1 className="text-white font-extrabold text-lg">👤 नया मरीज़</h1>
      </div>
      <div className="max-w-xl mx-auto px-4 py-4 space-y-3">
        {[
          { label: "नाम *", name: "name" },
          { label: "फोन", name: "phone", type: "tel" },
          { label: "उम्र", name: "age", type: "number" },
          { label: "पता", name: "address" },
          { label: "तकलीफ", name: "complaint" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
            <input type={f.type || "text"} name={f.name} value={form[f.name]} onChange={handle} className={inp} />
          </div>
        ))}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">लिंग</label>
          <select name="gender" value={form.gender} onChange={handle} className={inp}>
            <option value="">चुनो</option>
            <option value="पुरुष">पुरुष</option>
            <option value="महिला">महिला</option>
            <option value="अन्य">अन्य</option>
          </select>
        </div>
        <button onClick={handleSubmit} disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-lg disabled:opacity-50">
          {saving ? "सेव हो रहा है..." : "सेव करो"}
        </button>
      </div>
    </div>
  );
}