import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200 pb-24">
      
      {/* Sleek Navigation Bar */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-extrabold text-2xl tracking-tighter text-slate-900">ANCI.</div>
        <div className="flex items-center gap-6">
          <Link href="/developer" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
            Developer Portal
          </Link>
          <Link href="/developer" className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-slate-800 transition-all">
            Get API Key
          </Link>
        </div>
      </nav>

      {/* Hero & Live Demo Section */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Pitch */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide border border-emerald-100 uppercase">
            <span>Dynamic Pricing API</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            The Conversational <br className="hidden lg:block" />
            <span className="text-slate-400">Commerce Engine.</span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-md font-medium">
            Stop losing sales to fixed prices. Integrate the ANCI AI negotiator into your app, maximize your margins, and let the AI close the deal.
          </p>

          <div className="pt-6 flex flex-col gap-3 text-sm text-slate-600 font-bold">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Mathematical Guardrails (No AI Hallucinations)
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Secure Multi-Tenant Architecture
            </div>
          </div>
        </div>

        {/* Right Side: The Negotiation Widget Demo */}
        <div className="w-full max-w-md mx-auto relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative">
            {/* Try the demo below! */}
            <ChatWidget productId="prod_test_001" />
          </div>
        </div>
      </div>

      {/* The Integration Guide (How to use the SaaS) */}
      <div className="max-w-6xl mx-auto px-6 py-16 mt-8 border-t border-slate-200">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Integrate in minutes.</h2>
          <p className="text-slate-500 mt-3 font-medium text-lg">Start negotiating with your customers today using our secure REST API.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-sm">1</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Create an Account</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow font-medium">
              Head over to our Developer Portal. Create a free account and register your organization to get started.
            </p>
            <Link href="/developer" className="inline-block font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              Go to Portal →
            </Link>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-sm">2</div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Generate API Key</h3>
            <p className="text-slate-600 text-sm leading-relaxed flex-grow font-medium">
              Instantly generate your secure, private <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono text-xs border border-slate-200">anci_live_...</code> API key and receive 5,000 free negotiation credits for your app.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow bg-slate-900 text-white">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-sm">3</div>
            <h3 className="text-xl font-bold mb-3">Connect your App</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 flex-grow font-medium">
              Pass your key in the headers of your HTTP request to securely wake up the AI engine.
            </p>
            <div className="bg-black/50 p-3 rounded-xl border border-white/10">
              <code className="text-[10px] sm:text-xs text-emerald-400 font-mono break-all">
                Authorization: Bearer anci_live_xxx
              </code>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}
