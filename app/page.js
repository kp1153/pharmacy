export const dynamic = "force-dynamic";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700">
      <header className="bg-blue-950 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💊</span>
          <div>
            <h1 className="text-white text-xl font-bold">निशांत फार्मा प्रो</h1>
            <p className="text-blue-300 text-xs">दवा दुकान के लिए स्मार्ट बिलिंग</p>
          </div>
        </div>
        <Link href="/login"
          className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-lg font-semibold text-sm transition">
          लॉगिन
        </Link>
      </header>

      <section className="text-center py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          सबसे तेज़ बिलिंग सॉफ्टवेयर<br />
          <span className="text-green-400">आपकी दवा दुकान के लिए</span>
        </h2>
        <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
          जीएसटी बिल · स्टॉक मैनेजमेंट · उधारी ट्रैकिंग · डॉक्टर पर्चा — सब एक जगह।
        </p>
        <Link href="/login"
          className="bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition">
          मुफ्त आज़माओ
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "🧾", title: "तेज़ जीएसटी बिलिंग", desc: "मिनटों में बिल बनाओ, WhatsApp पर भेजो" },
          { icon: "📦", title: "स्टॉक मैनेजमेंट", desc: "एक्सपायरी अलर्ट, बैच ट्रैकिंग, कम स्टॉक चेतावनी" },
          { icon: "💰", title: "उधारी ट्रैकिंग", desc: "किसने कितना लिया, कब से — सब दर्ज" },
          { icon: "🏥", title: "डॉक्टर + फार्मेसी", desc: "डिजिटल पर्चा वर्कफ्लो — कागज़ रहित काउंटर" },
          { icon: "📊", title: "रिपोर्ट और मुनाफा", desc: "आइटम-वाइज़ मुनाफा, दैनिक/मासिक बिक्री" },
          { icon: "🔗", title: "जीएसटी-मोबाइल मैपिंग", desc: "GSTIN डालो — राज्य और PAN अपने आप भरेगा" },
        ].map((f, i) => (
          <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="text-white font-bold text-lg mb-1">{f.title}</h3>
            <p className="text-blue-200 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="text-center py-6 text-blue-300 text-sm border-t border-white/10">
        © 2026 निशांत सॉफ्टवेयर्स — भारत के लिए बना
      </footer>
    </main>
  );
}