import Link from "next/link";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* Top Navigation */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-extrabold text-2xl tracking-tighter text-slate-900">
            ANCI.
          </Link>
          <span className="text-sm font-semibold text-slate-400 border-l border-slate-200 pl-6 hidden sm:block">
            Documentation
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/developer" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
          <Link href="mailto:shopkabale@gmail.com" className="text-sm font-bold bg-slate-100 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all">
            Support
          </Link>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto w-full">
        
        {/* Left Sidebar (Sticky) */}
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-slate-200 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto py-8 pr-6">
          <nav className="space-y-8 pl-6">
            
            {/* Nav Group 1 */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Getting Started</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#overview" className="hover:text-emerald-600 transition-colors text-emerald-600">Overview</Link></li>
                <li><Link href="#architecture" className="hover:text-emerald-600 transition-colors">The Architecture</Link></li>
                <li><Link href="#quickstart" className="hover:text-emerald-600 transition-colors">Quickstart Guide</Link></li>
              </ul>
            </div>

            {/* Nav Group 2 */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">API Reference</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#auth" className="hover:text-emerald-600 transition-colors">Authentication</Link></li>
                <li><Link href="#create-session" className="hover:text-emerald-600 transition-colors">POST /sessions/create</Link></li>
                <li><Link href="#history" className="hover:text-emerald-600 transition-colors">GET /sessions/history</Link></li>
              </ul>
            </div>

            {/* Nav Group 3 */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Integration</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#widget" className="hover:text-emerald-600 transition-colors">The Chat Widget</Link></li>
                <li><Link href="#checkout" className="hover:text-emerald-600 transition-colors">Checkout Handoff</Link></li>
              </ul>
            </div>

          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-12 md:px-12 max-w-3xl">
          
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">ANCI API Documentation</h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Learn how to integrate the ANCI Conversational Commerce Engine into your application. Maximize margins and close deals automatically.
            </p>
          </div>

          <hr className="border-slate-200 mb-12" />

          {/* Placeholder for Section 1: Overview */}
          <section id="overview" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              ANCI is a Just-In-Time negotiation API. Instead of syncing your entire product database with our servers, your backend simply creates a secure "Vault Session" at the exact moment a user wants to negotiate.
            </p>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800 mb-6">
              <strong>Security First:</strong> Your secret floor prices never touch the frontend browser. Only the random Session ID is exposed.
            </div>
          </section>

          {/* We will inject the rest of the code blocks here in the next steps! */}
          <section id="create-session" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Create a Session</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Content for the API endpoint will go here...
            </p>
            <div className="bg-slate-900 rounded-xl p-6 shadow-sm">
              <code className="text-sm text-emerald-400 font-mono">
                // Code examples will look like this!
              </code>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
