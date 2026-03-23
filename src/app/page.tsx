import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 flex flex-col">
      {/* Dynamic Header Component */}
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Copy & Demo Context */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide border border-emerald-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Open Source API
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Stop losing sales to fixed prices.
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
              ANCI is an AI-powered negotiation engine that haggles with your customers in real-time, securing the highest possible profit margin.
            </p>
            
            {/* 🔥 THE DEMO EXPLANATION BOX */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">👇 Try the Live Demo</h3>
              <p className="text-sm text-slate-600 mb-4">
                Chat with the widget to see how the AI defends its margins. For this demo session, the AI has been given the following secret constraints:
              </p>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Ceiling Price (Starting)</span>
                  <span className="text-slate-900 font-bold">$15,000</span>
                </li>
                <li className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Floor Price (Secret Minimum)</span>
                  <span className="text-slate-900 font-bold">$10,000</span>
                </li>
              </ul>
              <p className="text-xs text-slate-400 mt-3 font-medium">💡 Try offering $9,000 and see what it says!</p>
            </div>

            <div className="flex gap-4">
              <Link href="/developer" className="bg-slate-900 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-all text-center flex-1 md:flex-none">
                Get API Key
              </Link>
              <Link href="/docs" className="bg-white border border-slate-200 text-slate-900 px-6 py-3.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all text-center flex-1 md:flex-none">
                Read Docs
              </Link>
            </div>
          </div>

          {/* Right Side: Widget */}
          <div className="relative w-full max-w-md mx-auto md:mx-0 md:ml-auto mt-8 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-blue-50 blur-3xl opacity-50 -z-10 rounded-full"></div>
            <ChatWidget />
          </div>

        </div>
      </main>

      {/* Dynamic Footer Component */}
      <Footer />
    </div>
  );
}
