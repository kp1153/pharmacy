"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "", address: "", phone: "", email: "",
    gstin: "", dlNo: "", city: "", state: "", pincode: "",
  });

  useEffect(() => { loadStores(); }, []);

  const loadStores = () => {
    fetch("/api/stores").then(r => r.json()).then(setStores).catch(() => {});
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", address: "", phone: "", email: "", gstin: "", dlNo: "", city: "", state: "", pincode: "" });
    setShowForm(true);
  };

  const openEdit = (store) => {
    setEditId(store.id);
    setForm({
      name: store.name || "",
      address: store.address || "",
      phone: store.phone || "",
      email: store.email || "",
      gstin: store.gstin || "",
      dlNo: store.dlNo || "",
      city: store.city || "",
      state: store.state || "",
      pincode: store.pincode || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name) return alert("Store name जरूरी है");
    const url = editId ? `/api/stores?id=${editId}` : "/api/stores";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      setEditId(null);
      loadStores();
    } else {
      alert("Error saving store");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Store हटाएं?")) return;
    await fetch(`/api/stores?id=${id}`, { method: "DELETE" });
    loadStores();
  };

  const inp = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-blue-700 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-blue-200 text-sm">← Back</Link>
        <h1 className="text-white font-extrabold text-lg">🏪 Stores</h1>
        <button onClick={openAdd}
          className="ml-auto bg-white text-blue-700 font-bold px-3 py-1.5 rounded-lg text-sm">
          + Add Store
        </button>
      </div>

      {showForm && (
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h2 className="font-bold text-gray-700">{editId ? "Edit Store" : "New Store"}</h2>
            <input name="name" placeholder="Store Name *" value={form.name} onChange={handleChange} className={inp} />
            <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className={inp} />
            <div className="flex gap-2">
              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className={inp} />
              <input name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inp} />
            </div>
            <div className="flex gap-2">
              <input name="gstin" placeholder="GSTIN" value={form.gstin} onChange={handleChange} className={inp} />
              <input name="dlNo" placeholder="DL No." value={form.dlNo} onChange={handleChange} className={inp} />
            </div>
            <div className="flex gap-2">
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} className={inp} />
              <input name="state" placeholder="State" value={form.state} onChange={handleChange} className={inp} />
              <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className={inp} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-xl text-sm">
                {editId ? "Update" : "Save"}
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-xl text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 space-y-3 py-4">
        {stores.length === 0 ? (
          <div className="text-center text-gray-400 py-20">कोई store नहीं है</div>
        ) : (
          stores.map(store => (
            <div key={store.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-800">{store.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(store)}
                    className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-lg">Edit</button>
                  <button onClick={() => handleDelete(store.id)}
                    className="text-xs bg-red-50 text-red-600 font-bold px-3 py-1 rounded-lg">Delete</button>
                </div>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                {store.address && <p>📍 {store.address}{store.city ? `, ${store.city}` : ""}{store.state ? `, ${store.state}` : ""}</p>}
                {store.phone && <p>📞 {store.phone}</p>}
                {store.email && <p>✉️ {store.email}</p>}
                {store.gstin && <p>GST: {store.gstin}</p>}
                {store.dlNo && <p>DL: {store.dlNo}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}