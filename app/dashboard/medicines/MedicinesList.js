"use client";
import { useState } from "react";

export default function MedicinesList({ medicines }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const today = new Date().toISOString().split("T")[0];
  const thirty = new Date();
  thirty.setDate(thirty.getDate() + 30);
  const thirtyStr = thirty.toISOString().split("T")[0];

  const filtered = medicines.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.generic || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.company || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "low") return matchSearch && m.stock <= 10;
    if (filter === "expiry") return matchSearch && m.expiry && m.expiry <= thirtyStr && m.stock > 0;
    if (filter === "out") return matchSearch && m.stock === 0;
    return matchSearch;
  });

  return (
    <div className="px-4 py-4 space-y-3">
      <input
        type="text"
        placeholder="🔍 नाम, जेनेरिक, कंपनी..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "all", label: "सभी" },
          { key: "low", label: "⚠️ कम स्टॉक" },
          { key: "expiry", label: "🔴 एक्सपायरी" },
          { key: "out", label: "❌ खत्म" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
              filter === f.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400">{filtered.length} दवाइयाँ मिलीं</p>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-10">कोई दवाई नहीं मिली</p>
      ) : (
        filtered.map((m) => {
          const expired = m.expiry && m.expiry < today;
          const nearExpiry = m.expiry && m.expiry <= thirtyStr && !expired;
          const outOfStock = m.stock === 0;
          const lowStock = m.stock > 0 && m.stock <= 10;

          return (
            <div
              key={m.id}
              className={`bg-white rounded-xl border px-4 py-3 shadow-sm ${
                expired ? "border-red-300" : nearExpiry ? "border-amber-300" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-base truncate">{m.name}</p>
                  {m.generic && <p className="text-xs text-gray-400">{m.generic}</p>}
                  {m.company && <p className="text-xs text-gray-400">{m.company}</p>}
                </div>
                <div className="ml-3 text-right shrink-0">
                  <p className="font-extrabold text-blue-700 text-base">₹{m.mrp}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    outOfStock ? "bg-red-100 text-red-600" :
                    lowStock ? "bg-amber-100 text-amber-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    स्टॉक: {m.stock}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                {m.batch && <span>बैच: {m.batch}</span>}
                {m.expiry && (
                  <span className={expired ? "text-red-600 font-bold" : nearExpiry ? "text-amber-600 font-bold" : ""}>
                    {expired ? "❌ एक्सपायर्ड" : nearExpiry ? "⚠️ " : ""}एक्सपायरी: {m.expiry}
                  </span>
                )}
                {m.rack && <span>रैक: {m.rack}</span>}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}