"use client";
import { useEffect, useState } from "react";

export default function CreditPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ patientName: "", patientPhone: "", amount: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  async function load() {
    const res = await fetch("/api/credit");
    if (res.ok) setList(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!form.patientName || !form.amount) return;
    setSaving(true);
    await fetch("/api/credit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ patientName: "", patientPhone: "", amount: "", note: "" });
    setSaving(false);
    load();
  }

  async function handlePay(id) {
    if (!payAmount) return;
    await fetch(`/api/credit/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid: parseFloat(payAmount) }),
    });
    setPayingId(null);
    setPayAmount("");
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/credit/${id}`, { method: "DELETE" });
    load();
  }

  const pending = list.filter(r => r.paid < r.amount);
  const cleared = list.filter(r => r.paid >= r.amount);
  const totalPending = pending.reduce((s, r) => s + (r.amount - r.paid), 0);

  return (
    <div className="pt-4">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Credit</h1>
      <p className="text-sm text-gray-500 mb-4">Track outstanding payments</p>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-5 flex flex-col gap-3">
        <p className="font-semibold text-gray-700 text-sm">Add Credit Entry</p>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))}
            placeholder="Patient Name *" className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input value={form.patientPhone} onChange={e => setForm(f => ({ ...f, patientPhone: e.target.value }))}
            placeholder="Phone" inputMode="numeric" className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            placeholder="Amount ₹ *" inputMode="numeric" className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            placeholder="Note" className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        <button onClick={handleAdd} disabled={saving}
          className="bg-blue-600 text-white py-2 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 transition">
          {saving ? "Saving..." : "Add Entry"}
        </button>
      </div>

      {pending.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-red-700">Total Pending</p>
          <p className="text-xl font-extrabold text-red-700">₹{totalPending.toFixed(0)}</p>
        </div>
      )}

      {loading && <p className="text-center text-gray-400 mt-10">Loading...</p>}

      {!loading && pending.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-bold text-gray-700 mb-2">Pending ({pending.length})</p>
          <div className="flex flex-col gap-2">
            {pending.map(r => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{r.patientName}</p>
                    <p className="text-xs text-gray-400">{r.patientPhone} {r.note ? "· " + r.note : ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-extrabold text-red-600">₹{(r.amount - r.paid).toFixed(0)}</p>
                    <p className="text-xs text-gray-400">of ₹{r.amount}</p>
                  </div>
                </div>
                {payingId === r.id ? (
                  <div className="flex gap-2 mt-2">
                    <input value={payAmount} onChange={e => setPayAmount(e.target.value)}
                      placeholder="Amount paid" inputMode="numeric"
                      className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <button onClick={() => handlePay(r.id)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                      Save
                    </button>
                    <button onClick={() => { setPayingId(null); setPayAmount(""); }}
                      className="bg-gray-200 text-gray-600 px-3 py-1.5 rounded-xl text-sm font-semibold transition">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => { setPayingId(r.id); setPayAmount(""); }}
                      className="flex-1 bg-green-50 border border-green-200 text-green-700 py-1.5 rounded-xl text-sm font-semibold hover:bg-green-100 transition">
                      Mark Payment
                    </button>
                    <button onClick={() => handleDelete(r.id)}
                      className="bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-xl text-sm font-semibold hover:bg-red-100 transition">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && cleared.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-bold text-gray-500 mb-2">Cleared ({cleared.length})</p>
          <div className="flex flex-col gap-2">
            {cleared.map(r => (
              <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-600">{r.patientName}</p>
                  <p className="text-xs text-gray-400">{r.patientPhone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-green-600">✓ ₹{r.amount}</p>
                  <button onClick={() => handleDelete(r.id)}
                    className="text-gray-400 text-xs hover:text-red-500 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && list.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          <div className="text-4xl mb-2">📒</div>
          <p>No credit entries</p>
        </div>
      )}
    </div>
  );
}