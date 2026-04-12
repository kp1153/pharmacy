"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function BankReconciliationPage() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: "", description: "", amount: "", type: "credit",
    category: "sales", referenceNo: "", bankName: "", remarks: "",
  });

  useEffect(() => {
    fetch("/api/bank-reconciliation")
      .then(r => r.json())
      .then(setTransactions)
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.date || !form.description || !form.amount) return alert("Date, Description और Amount जरूरी है");
    const res = await fetch("/api/bank-reconciliation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ date: "", description: "", amount: "", type: "credit", category: "sales", referenceNo: "", bankName: "", remarks: "" });
      fetch("/api/bank-reconciliation").then(r => r.json()).then(setTransactions);
    } else {
      alert("Error saving transaction");
    }
  };

  const handleReconcile = async (id, current) => {
    await fetch(`/api/bank-reconciliation?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reconciled: current ? 0 : 1 }),
    });
    fetch("/api/bank-reconciliation").then(r => r.json()).then(setTransactions);
  };

  const totalCredit = transactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalDebit = transactions.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const balance = totalCredit - totalDebit;

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-blue-200 text-sm">← Back</Link>
        <h1 className="text-white font-extrabold text-lg">🏦 Bank Reconciliation</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="ml-auto bg-white text-blue-700 font-bold px-3 py-1.5 rounded-lg text-sm">
          + Add
        </button>
      </div>

      {/* Summary */}
      <div className="max-w-2xl mx-auto px-4 py-4 grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-xs text-green-600 font-semibold">Total Credit</p>
          <p className="text-lg font-extrabold text-green-700">₹{totalCredit.toFixed(0)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-xs text-red-600 font-semibold">Total Debit</p>
          <p className="text-lg font-extrabold text-red-700">₹{totalDebit.toFixed(0)}</p>
        </div>
        <div className={`border rounded-xl p-3 text-center ${balance >= 0 ? "bg-blue-50 border-blue-200" : "bg-orange-50 border-orange-200"}`}>
          <p className="text-xs font-semibold text-gray-600">Balance</p>
          <p className={`text-lg font-extrabold ${balance >= 0 ? "text-blue-700" : "text-orange-700"}`}>₹{balance.toFixed(0)}</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-bold text-gray-700">New Transaction</h2>
            <input name="date" type="date" value={form.date} onChange={handleChange} className={inp} />
            <input name="description" placeholder="Description *" value={form.description} onChange={handleChange} className={inp} />
            <div className="flex gap-2">
              <input name="amount" type="number" placeholder="Amount *" value={form.amount} onChange={handleChange} className={inp} />
              <select name="type" value={form.type} onChange={handleChange} className={inp}>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </div>
            <select name="category" value={form.category} onChange={handleChange} className={inp}>
              <option value="sales">Sales</option>
              <option value="purchase">Purchase</option>
              <option value="salary">Salary</option>
              <option value="rent">Rent</option>
              <option value="misc">Misc</option>
            </select>
            <div className="flex gap-2">
              <input name="referenceNo" placeholder="Reference No." value={form.referenceNo} onChange={handleChange} className={inp} />
              <input name="bankName" placeholder="Bank Name" value={form.bankName} onChange={handleChange} className={inp} />
            </div>
            <input name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} className={inp} />
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-xl text-sm">Save</button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-xl text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="max-w-2xl mx-auto px-4 space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-400 py-20">कोई transaction नहीं है</div>
        ) : (
          transactions.map(t => (
            <div key={t.id} className={`bg-white rounded-xl border p-4 shadow-sm ${t.reconciled ? "border-green-200" : "border-gray-200"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-800 text-sm">{t.description}</span>
                <span className={`font-extrabold text-base ${t.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {t.type === "credit" ? "+" : "-"}₹{t.amount.toFixed(0)}
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <p>{t.date} &nbsp;|&nbsp; {t.category} &nbsp;|&nbsp; {t.bankName || "—"}</p>
                {t.referenceNo && <p>Ref: {t.referenceNo}</p>}
                {t.remarks && <p>Remarks: {t.remarks}</p>}
              </div>
              <div className="mt-2">
                <button onClick={() => handleReconcile(t.id, t.reconciled)}
                  className={`text-xs font-bold px-3 py-1 rounded-full ${t.reconciled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {t.reconciled ? "✅ Reconciled" : "Mark Reconciled"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}