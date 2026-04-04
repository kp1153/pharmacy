"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GST_STATES = {
  "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab",
  "04": "Chandigarh", "05": "Uttarakhand", "06": "Haryana",
  "07": "Delhi", "08": "Rajasthan", "09": "Uttar Pradesh",
  "10": "Bihar", "11": "Sikkim", "12": "Arunachal Pradesh",
  "13": "Nagaland", "14": "Manipur", "15": "Mizoram",
  "16": "Tripura", "17": "Meghalaya", "18": "Assam",
  "19": "West Bengal", "20": "Jharkhand", "21": "Odisha",
  "22": "Chhattisgarh", "23": "Madhya Pradesh", "24": "Gujarat",
  "26": "Dadra & Nagar Haveli and Daman & Diu", "27": "Maharashtra",
  "28": "Andhra Pradesh", "29": "Karnataka", "30": "Goa",
  "31": "Lakshadweep", "32": "Kerala", "33": "Tamil Nadu",
  "34": "Puducherry", "35": "Andaman & Nicobar", "36": "Telangana",
  "37": "Andhra Pradesh (New)", "38": "Ladakh",
};

function validateGSTIN(gstin) {
  if (!gstin || gstin.length !== 15) return false;
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(gstin.toUpperCase());
}

function decodeGSTIN(gstin) {
  const g = gstin.toUpperCase();
  const stateCode = g.slice(0, 2);
  const pan = g.slice(2, 12);
  const state = GST_STATES[stateCode] || null;
  return { state, pan, stateCode };
}

export default function NewSupplier() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", gstNo: "", state: "" });
  const [gstError, setGstError] = useState("");

  function handle(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleGSTBlur() {
    const gstin = form.gstNo.trim();
    if (!gstin) { setGstError(""); return; }
    if (!validateGSTIN(gstin)) {
      setGstError("GSTIN invalid — 15 characters, format: 22AAAAA0000A1Z5");
      return;
    }
    setGstError("");
    const { state } = decodeGSTIN(gstin);
    if (state) setForm((prev) => ({ ...prev, state }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/suppliers");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white px-6 py-3 flex items-center gap-4 shadow-md">
        <Link href="/suppliers" className="text-blue-300 hover:text-white text-sm">← Back</Link>
        <h1 className="text-lg font-bold">🏭 Add Supplier</h1>
      </header>
      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
              <input type="text" name="name" value={form.name} onChange={handle} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              <input
                type="text" name="gstNo" value={form.gstNo}
                onChange={(e) => setForm({ ...form, gstNo: e.target.value.toUpperCase() })}
                onBlur={handleGSTBlur}
                maxLength={15}
                placeholder="22AAAAA0000A1Z5"
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${gstError ? "border-red-400" : "border-gray-300"}`}
              />
              {gstError && <p className="text-red-500 text-xs mt-1">{gstError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-gray-400 font-normal">(GSTIN से auto-fill)</span>
              </label>
              <input type="text" name="state" value={form.state} onChange={handle}
                placeholder="GSTIN डालने पर भरेगा"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="address" value={form.address} onChange={handle}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <button type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
              Save Supplier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}