import Link from "next/link";

const features = [
  {
    icon: "🧾",
    en: { title: "Fast GST Billing", desc: "Create itemized GST bills in seconds with automatic tax calculation. Send receipts directly via WhatsApp. Supports cash, UPI, and credit payments." },
    hi: { title: "तेज़ जीएसटी बिलिंग", desc: "सेकंडों में जीएसटी बिल बनाएं, टैक्स अपने आप कैलकुलेट होगा। WhatsApp पर रसीद भेजें।" },
  },
  {
    icon: "📦",
    en: { title: "Stock Management", desc: "Track every medicine by batch number and expiry date. Get alerts for near-expiry stock and automatic reorder warnings when stock falls below threshold." },
    hi: { title: "स्टॉक मैनेजमेंट", desc: "हर दवा को बैच नंबर और एक्सपायरी से ट्रैक करें। कम स्टॉक और एक्सपायरी पर अलर्ट मिलेगा।" },
  },
  {
    icon: "📒",
    en: { title: "Credit Tracking", desc: "Record outstanding payments against each customer. Mark partial or full payments and instantly see total pending amount across all customers." },
    hi: { title: "उधारी ट्रैकिंग", desc: "हर ग्राहक का उधार दर्ज करें। आंशिक या पूरा भुगतान मार्क करें। कुल बकाया एक नज़र में देखें।" },
  },
  {
    icon: "🔒",
    en: { title: "Narcotic Register", desc: "Schedule H and H1 medicines are automatically logged with patient details, doctor name, and prescription number — compliant with drug regulations." },
    hi: { title: "नारकोटिक रजिस्टर", desc: "Schedule H/H1 दवाओं की बिक्री अपने आप दर्ज होती है। ड्रग रेगुलेशन के अनुसार पूरी जानकारी सुरक्षित।" },
  },
  {
    icon: "📊",
    en: { title: "GST & Tally Export", desc: "Export monthly sales and purchase data as CSV in one click. Ready-to-use format for GSTR-1, GSTR-3B filing and Tally import by your accountant." },
    hi: { title: "जीएसटी और टैली एक्सपोर्ट", desc: "एक क्लिक में महीने का डेटा CSV में डाउनलोड करें। GSTR-1, GSTR-3B और Tally के लिए तैयार फॉर्मेट।" },
  },
  {
    icon: "📈",
    en: { title: "Reports & Analytics", desc: "View daily and monthly sales, purchase summaries, profit margins, top-selling medicines, and bank reconciliation — all from your phone or PC." },
    hi: { title: "रिपोर्ट और एनालिटिक्स", desc: "रोज़ और महीने की बिक्री, खरीद, मुनाफा, टॉप दवाएं — सब मोबाइल या PC पर देखें।" },
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">

      <header className="bg-blue-950 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💊</span>
          <div>
            <h1 className="text-white text-xl font-bold">Nishant Pharma Pro</h1>
            <p className="text-blue-300 text-xs">Smart Billing for Medical Stores · दवा दुकान के लिए</p>
          </div>
        </div>
        <Link href="/login"
          className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-lg font-semibold text-sm transition">
          Login · लॉगिन
        </Link>
      </header>

      <section className="text-center py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
          The Fastest Billing Software<br />
          <span className="text-green-400">Built for Indian Medical Stores</span>
        </h2>
        <p className="text-blue-300 text-xl font-semibold mb-2">
          सबसे तेज़ बिलिंग सॉफ्टवेयर — भारतीय दवा दुकानों के लिए
        </p>
        <p className="text-blue-200 text-base mb-3 max-w-2xl mx-auto">
          GST Billing · Stock Management · Credit Tracking · Narcotic Log — all in one place.
        </p>
        <p className="text-blue-300 text-sm mb-8 max-w-xl mx-auto">
          जीएसटी बिलिंग · स्टॉक मैनेजमेंट · उधारी ट्रैकिंग · नारकोटिक लॉग — सब एक जगह।
        </p>
        <Link href="/login"
          className="bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition">
          Get Started · शुरू करें
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-white font-bold text-lg mb-1">{f.en.title}</h3>
            <p className="text-blue-100 text-sm mb-3">{f.en.desc}</p>
            <h3 className="text-green-300 font-bold text-base mb-1">{f.hi.title}</h3>
            <p className="text-blue-300 text-sm">{f.hi.desc}</p>
          </div>
        ))}
      </section>

      <footer className="text-center py-6 text-blue-300 text-sm border-t border-white/10">
        © 2026 Nishant Softwares · निशांत सॉफ्टवेयर्स — Made for India · भारत के लिए बना
      </footer>

    </main>
  );
}