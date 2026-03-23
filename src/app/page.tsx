import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      
      {/* Sleek Navigation Bar */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tighter">ANCI.</div>
        <div className="text-sm font-medium text-slate-500">Storefront Demo</div>
      </nav>

      {/* Main Layout */}
      <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Product Details */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide border border-emerald-100 uppercase">
            <span>Dynamic Pricing Active</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Enterprise SaaS <br className="hidden md:block" />
            <span className="text-slate-400">Negotiation Engine.</span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-md">
            Unlock the full potential of your e-commerce platform. No fixed prices. Our AI finds the perfect deal for every single customer, maximizing your margins.
          </p>

          <div className="pt-6 border-t border-slate-200 flex flex-col gap-3 text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Unlimited API Rate Limits
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Dedicated B2B Support
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Custom AI Guardrails
            </div>
          </div>
        </div>

        {/* Right Side: The Negotiation Widget */}
        <div className="w-full max-w-md mx-auto relative">
          {/* Subtle background glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl blur-lg opacity-50"></div>
          
          <div className="relative">
            <ChatWidget productId="prod_enterprise_001" />
          </div>
        </div>

      </div>
    </main>
  );
}
