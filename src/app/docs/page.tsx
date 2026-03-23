"use client";

import { useState } from "react";
import Link from "next/link";

// 🛠️ The Reusable Copyable Code Block Component
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-sm my-6 border border-slate-800">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50 border-b border-slate-800">
        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">{language}</span>
        <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 hover:border-slate-500">
          {copied ? (
            <><svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span className="text-xs font-bold text-emerald-400">Copied!</span></>
          ) : (
            <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><span className="text-xs font-medium">Copy</span></>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto scrollbar-hide">
        <pre className="text-sm text-emerald-400 font-mono whitespace-pre leading-relaxed">{code.trim()}</pre>
      </div>
    </div>
  );
};

export default function Documentation() {
  
  const createSessionCode = `
const response = await fetch("https://your-anci-domain.com/api/sessions/create", {
  method: "POST",
  headers: {
    "Authorization": "Bearer anci_live_YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    productName: "MacBook Pro M3",
    merchantProductId: "sku_9982",
    basePrice: 1200,
    ceilingPrice: 1800
  })
});

const data = await response.json();
console.log(data.sessionId); // Pass this token to your frontend widget!
  `;

  const getHistoryCode = `
const response = await fetch("https://your-anci-domain.com/api/sessions/history?uid=YOUR_MERCHANT_ID", {
  method: "GET",
  headers: {
    "Authorization": "Bearer anci_live_YOUR_API_KEY",
    "Content-Type": "application/json"
  }
});

const data = await response.json();
console.log(data.sessions); // Returns an array of your 10 most recent negotiations
  `;

  const embedCode = `
<iframe 
  src="https://your-anci-domain.com/widget?sessionId=YOUR_GENERATED_SESSION_ID" 
  width="100%" 
  height="500px" 
  style="border: none; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
</iframe>
  `;

  const checkoutCode = `
// Listen for events from the embedded ANCI Chat Widget
window.addEventListener("message", (event) => {
  // Security check: Ensure the message is from ANCI
  // if (event.origin !== "https://your-anci-domain.com") return;

  if (event.data?.action === "ANCI_DEAL_CLOSED") {
    const payload = event.data.payload;
    
    console.log("Deal closed for session:", payload.sessionId);
    console.log("Product ID:", payload.productId);
    console.log("Final Negotiated Price: $", payload.finalPrice);

    // TODO: Add the item to your Shopify/Custom cart at this specific price
    // Example: addToCart(payload.productId, payload.finalPrice);
    
    // Redirect the user to checkout
    // window.location.href = "/checkout";
  }
});
  `;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 pb-32">
      
      {/* Top Navigation */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-extrabold text-2xl tracking-tighter text-slate-900">ANCI.</Link>
          <span className="text-sm font-semibold text-slate-400 border-l border-slate-200 pl-6 hidden sm:block">Documentation</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/developer" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Dashboard</Link>
          <Link href="mailto:shopkabale@gmail.com" className="text-sm font-bold bg-slate-100 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all">Support</Link>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto w-full">
        
        {/* Left Sidebar (Sticky) */}
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-slate-200 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto py-8 pr-6">
          <nav className="space-y-8 pl-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">1. Overview</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#introduction" className="hover:text-emerald-600 transition-colors">Introduction</Link></li>
                <li><Link href="#architecture" className="hover:text-emerald-600 transition-colors">The Architecture</Link></li>
                <li><Link href="#authentication" className="hover:text-emerald-600 transition-colors">Authentication</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">2. Quickstart</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#quickstart" className="hover:text-emerald-600 transition-colors">Integration Steps</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">3. API Reference</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#create-session" className="hover:text-emerald-600 transition-colors">POST /sessions/create</Link></li>
                <li><Link href="#get-history" className="hover:text-emerald-600 transition-colors">GET /sessions/history</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">4. Frontend Integration</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#widget" className="hover:text-emerald-600 transition-colors">Embedding the Widget</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">5. Checkout Handoff</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#events" className="hover:text-emerald-600 transition-colors">Listening for Events</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">6. Best Practices</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#security" className="hover:text-emerald-600 transition-colors">Security Guidelines</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-12 md:px-12 max-w-4xl">
          
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">ANCI API Documentation</h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              The complete guide to integrating the Conversational Commerce Engine into your application. Maximize margins, automate haggling, and close deals securely.
            </p>
          </div>

          {/* 1. OVERVIEW */}
          <section id="introduction" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Overview</h2>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Introduction</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              ANCI is an AI-powered negotiation API designed for e-commerce, real estate, and B2B SaaS. It allows merchants to offer dynamic pricing based on a hidden floor and ceiling price, letting an AI agent haggle with the customer to secure the highest possible profit margin.
            </p>

            <h3 id="architecture" className="text-lg font-bold text-slate-800 mb-2 mt-8">The Architecture (Just-In-Time Vaults)</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              ANCI does <strong>not</strong> require you to upload your product catalog to our servers. Instead, we use a Just-In-Time architecture.  At the exact moment a customer clicks "Negotiate" on your site, your backend securely pings ANCI with the secret prices. ANCI locks these in a vault and returns a secure `sessionId` token to pass to the frontend widget.
            </p>

            <h3 id="authentication" className="text-lg font-bold text-slate-800 mb-2 mt-8">Authentication</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              All backend API requests require your secret API key, which starts with <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200">anci_live_</code>. Include this in the `Authorization` header of your HTTP requests as a Bearer token.
            </p>
            <div className="bg-slate-900 rounded-xl p-4 shadow-sm font-mono text-sm text-emerald-400">
              Authorization: Bearer anci_live_YOUR_SECRET_KEY
            </div>
          </section>

          {/* 2. QUICKSTART GUIDE */}
          <section id="quickstart" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Quickstart Guide</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Get your API Key</h4>
                  <p className="text-slate-600 text-sm mt-1">Navigate to the Developer Dashboard, register your organization, and copy your secure `anci_live_` key.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Initialize a Session (Backend)</h4>
                  <p className="text-slate-600 text-sm mt-1">When a user wants to negotiate, have your server call `POST /sessions/create` to lock in your hidden prices and get a `sessionId`.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Embed the Widget (Frontend)</h4>
                  <p className="text-slate-600 text-sm mt-1">Pass the generated `sessionId` to the ANCI Chat Widget on your website.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Handle Checkout Handoff</h4>
                  <p className="text-slate-600 text-sm mt-1">Listen for the `ANCI_DEAL_CLOSED` Javascript event and add the product to your cart at the new negotiated price.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 3. BACKEND API REFERENCE */}
          <section id="create-session" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">3. Backend API Reference</h2>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs tracking-wider uppercase">POST</span>
              /api/sessions/create
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">Initializes a secure vault session for a specific product negotiation.</p>

            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Request Body Parameters</h4>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border-collapse border border-slate-200 rounded-lg">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-900">
                    <th className="px-4 py-3 font-semibold">Parameter</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  <tr>
                    <td className="px-4 py-3 font-mono text-slate-800 font-semibold">productName <span className="text-red-500">*</span></td>
                    <td className="px-4 py-3 text-slate-500">string</td>
                    <td className="px-4 py-3 text-slate-600">The human-readable name of the product the AI is selling.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-slate-800 font-semibold">merchantProductId</td>
                    <td className="px-4 py-3 text-slate-500">string</td>
                    <td className="px-4 py-3 text-slate-600">Your internal database ID or SKU for this product.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-slate-800 font-semibold">basePrice <span className="text-red-500">*</span></td>
                    <td className="px-4 py-3 text-slate-500">number</td>
                    <td className="px-4 py-3 text-slate-600">The absolute minimum price (floor) you are willing to accept.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-slate-800 font-semibold">ceilingPrice <span className="text-red-500">*</span></td>
                    <td className="px-4 py-3 text-slate-500">number</td>
                    <td className="px-4 py-3 text-slate-600">The initial asking price (anchor) the AI will start at.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CodeBlock code={createSessionCode} language="Node.js" />

            <h3 id="get-history" className="text-xl font-bold text-slate-900 mb-3 mt-12 flex items-center gap-3">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs tracking-wider uppercase">GET</span>
              /api/sessions/history
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">Programmatically fetch your organization's 10 most recent negotiations (both active and closed).</p>
            <CodeBlock code={getHistoryCode} language="Node.js" />
          </section>

          {/* 4. FRONTEND INTEGRATION */}
          <section id="widget" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Frontend Integration</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Once your backend generates the `sessionId`, you must pass it to the frontend to load the Chat Widget. If you are not using React, you can embed the widget using a simple iframe.
            </p>
            <CodeBlock code={embedCode} language="HTML" />
          </section>

          {/* 5. CHECKOUT HANDOFF */}
          <section id="events" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. The Checkout Handoff</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              When the AI and the customer agree on a price, the widget broadcasts an <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200">ANCI_DEAL_CLOSED</code> event via the browser's `postMessage` API. Your frontend must listen for this event and update your shopping cart.
            </p>
            <CodeBlock code={checkoutCode} language="JavaScript" />
          </section>

          {/* 6. SECURITY */}
          <section id="security" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Security & Best Practices</h2>
            <ul className="list-disc pl-5 space-y-4 text-slate-600 leading-relaxed">
              <li><strong>Never expose your API Key:</strong> Your <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200">anci_live_</code> key should only ever be used on your backend server. Never place it in your frontend React or HTML code.</li>
              <li><strong>Pass only the Session ID:</strong> The frontend widget only needs the random `sessionId` to function. This ensures hackers cannot inspect network traffic to find your hidden floor prices.</li>
              <li><strong>Realistic Margins:</strong> For the best AI behavior, ensure your `basePrice` and `ceilingPrice` have a realistic gap (e.g., a 20-30% variance).</li>
            </ul>
          </section>

          {/* 7. SUPPORT */}
          <section className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Help & Support</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Need help architecting your implementation or increasing your API credit limit? Our engineering team is here to help.
            </p>
            <a href="mailto:shopkabale@gmail.com" className="inline-flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Contact Support (shopkabale@gmail.com)
            </a>
          </section>

        </main>
      </div>
    </div>
  );
}
