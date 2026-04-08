"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [form, setForm] = useState({ clinicName: "", ownerName: "", address: "", phone: "", email: "", gstin: "", dlNo: "", city: "", state: "", pincode: "", tagline: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => { if (data) setForm(data); });
  }, []);

  function handle(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit() {
    setSaving(true);
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-blue-700 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-blue-200 text-sm">← वापस</Link>
          <h1 className="text-white font-extrabold text-lg">⚙️ सेटिंग</h1>
        </div>
        <a href="/api/auth/logout" className="text-blue-200 text-sm border border-blue-400 px-3 py-1.5 rounded-lg">लॉगआउट</a>
      </div>
      <div className="max-w-xl mx-auto px-4 py-4 space-y-3">
        {[
          { label: "दुकान का नाम", name: "clinicName" },
          { label: "मालिक का नाम", name: "ownerName" },
          { label: "फोन", name: "phone", type: "tel" },
          { label: "ईमेल", name: "email", type: "email" },
          { label: "पता", name: "address" },
          { label: "शहर", name: "city" },
          { label: "राज्य", name: "state" },
          { label: "पिनकोड", name: "pincode" },
          { label: "जीएसटीआईएन", name: "gstin" },
          { label: "ड्रग लाइसेंस नं.", name: "dlNo" },
          { label: "टैगलाइन", name: "tagline" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
            <input type={f.type || "text"} name={f.name} value={form[f.name] || ""} onChange={handle} className={inp} />
          </div>
        ))}
        <button onClick={handleSubmit} disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-lg disabled:opacity-50">
          {saved ? "✅ सेव हो गया" : saving ? "सेव हो रहा है..." : "सेव करो"}
        </button>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-50">
        {[
          { label: "होम", icon: "🏠", href: "/dashboard" },
          { label: "दवाइयाँ", icon: "💊", href: "/dashboard/medicines" },
          { label: "बिल", icon: "🧾", href: "/dashboard/sales" },
          { label: "मरीज़", icon: "👤", href: "/dashboard/patients" },
          { label: "सेटिंग", icon: "⚙️", href: "/dashboard/settings" },
        ].map((n) => (
          <Link key={n.href} href={n.href} className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-blue-600 text-xs font-medium">
            <span className="text-xl">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}