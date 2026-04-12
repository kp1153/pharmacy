export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-3">💊</div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Nishant Pharma Pro</h1>
        <p className="text-gray-500 text-sm mb-8">Smart Billing for Medical Stores</p>
        <a href="/api/auth/google"
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-xl py-3 px-4 text-gray-700 font-semibold hover:bg-gray-50 transition text-base">
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Login with Google
        </a>
        <p className="text-xs text-gray-400 mt-6">7 days free trial — no card required</p>
      </div>
    </main>
  );
}