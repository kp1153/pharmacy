"use client";
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-white text-blue-700 font-bold text-sm px-4 py-1.5 rounded-lg"
    >
      🖨️ प्रिंट
    </button>
  );
}