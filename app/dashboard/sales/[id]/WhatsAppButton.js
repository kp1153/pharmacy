"use client";

export default function WhatsAppButton({ phone, billNo, patientName, netAmount, items, shopName }) {
  function handleClick() {
    const phone_ = phone.replace(/\D/g, "");
    const fullPhone = phone_.startsWith("91") ? phone_ : `91${phone_}`;

    const itemLines = items.map((i) => `  • ${i.medicineName} x${i.qty} = ₹${i.amount}`).join("\n");

    const msg = `*${shopName}*\n*Bill: ${billNo}*\n\nDear ${patientName || "Customer"},\n\nYour bill details:\n${itemLines}\n\n*Total: ₹${netAmount}*\n\nThank you! Take medicines as prescribed by doctor.`;

    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <button
      onClick={handleClick}
      className="bg-green-500 text-white font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-green-600 active:scale-95 transition"
    >
      📲 WhatsApp
    </button>
  );
}