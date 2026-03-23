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
  `;

  const createSessionResponse = `
{
  "status": "success",
  "sessionId": "sess_8f7d6e5c4b3a21",
  "message": "Session vault created securely."
}
  `;

  const getHistoryCode = `
const response = await fetch("https://your-anci-domain.com/api/sessions/history?uid=YOUR_MERCHANT_ID", {
  method: "GET",
  headers: {
    "Authorization": "Bearer anci_live_YOUR_API_KEY",
    "Content-Type": "application/json"
  }
});
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
  // if (event.origin !== "https://your-anci-domain.com") return;

  if (event.data?.action === "ANCI_DEAL_CLOSED") {
    const payload = event.data.payload;
    
    console.log("Session:", payload.sessionId);
    console.log("Product:", payload.productId);
    console.log("Final Price: $", payload.finalPrice);

    // e.g., addToCart(payload.productId, payload.finalPrice);
    // window.location.href = "/checkout";
  }
});
  `;

  const checkoutPayload = `
{
  "action": "ANCI_DEAL_CLOSED",
  "payload": {
    "sessionId": "sess_8f7d6e5c4b3a21",
    "productId": "sku_9982",
    "finalPrice": 1450,
    "currency": "USD"
  }
}
  `;

  const errorCode = `
{
  "error": "UNAUTHORIZED",
  "message": "Invalid API Key provided."
}
  `;

  const endToEndCode = `
// 1. User clicks "Negotiate" on your frontend
async function handleNegotiateClick(product) {
  
  // 2. Your backend creates the ANCI session securely
  const sessionData = await fetch('/your-backend/create-anci-session', {
    method: 'POST', body: JSON.stringify(product)
  }).then(res => res.json());

  // 3. You display the ANCI widget with the new Session ID
  openAnciModal(sessionData.sessionId);
}

// 4. Listen for the deal to close
window.addEventListener("message", (event) => {
  if (event.data?.action === "ANCI_DEAL_CLOSED") {
    // 5. Add to cart & redirect to checkout!
    addToCart(event.data.payload.productId, event.data.payload.finalPrice);
    window.location.href = "/checkout";
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
          <Link href="/developer" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Dashboard</Link>
          <Link href="mailto:shopkabale@gmail.com" className="text-sm font-bold bg-slate-100 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all">Support</Link>
        </div>
      </nav>

      <div className="flex max-w-7xl mx-auto w-full">
        
        {/* Left Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0 border-r border-slate-200 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto py-8 pr-6">
          <nav className="space-y-8 pl-6">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">1. Overview</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#introduction" className="hover:text-emerald-600 transition-colors">Introduction</Link></li>
                <li><Link href="#architecture" className="hover:text-emerald-600 transition-colors">The Architecture</Link></li>
                <li><Link href="#pricing" className="hover:text-emerald-600 transition-colors">Rate Limits & Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">2. Quickstart</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#quickstart" className="hover:text-emerald-600 transition-colors">Integration Steps</Link></li>
                <li><Link href="#end-to-end" className="hover:text-emerald-600 transition-colors">End-to-End Example</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">3. API Reference</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#create-session" className="hover:text-emerald-600 transition-colors">POST /sessions/create</Link></li>
                <li><Link href="#get-history" className="hover:text-emerald-600 transition-colors">GET /sessions/history</Link></li>
                <li><Link href="#errors" className="hover:text-emerald-600 transition-colors">Error Handling</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">4. Frontend & Webhooks</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#widget" className="hover:text-emerald-600 transition-colors">Embedding the Widget</Link></li>
                <li><Link href="#events" className="hover:text-emerald-600 transition-colors">Checkout Event Payload</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-12 md:px-12 max-w-4xl">
          
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">ANCI API Documentation</h1>
            {/* 🔥 KILLER POSITIONING LINE */}
            <p className="text-xl font-bold text-emerald-600 mb-4">
              ANCI lets your app negotiate prices automatically and close deals in real time.
            </p>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              The complete guide to integrating the Conversational Commerce Engine. Maximize margins, automate haggling, and convert browsers into buyers securely.
            </p>
            
            {/* SDK Helper Mention */}
            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wide border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Coming Soon: Official Node.js & React SDKs
            </div>
          </div>

          {/* 1. OVERVIEW */}
          <section id="introduction" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Overview</h2>
            <h3 id="architecture" className="text-lg font-bold text-slate-800 mb-2 mt-8">The Architecture (Just-In-Time Vaults)</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              ANCI uses a Just-In-Time architecture. At the exact moment a customer clicks "Negotiate", your backend securely pings ANCI with your secret floor and ceiling prices. ANCI locks these in a vault and returns a secure `sessionId` token to pass to the frontend widget. Your secret prices never touch the frontend browser.
            </p>

            {/* 🔥 RATE LIMITS & PRICING */}
            <h3 id="pricing" className="text-lg font-bold text-slate-800 mb-2 mt-8">Rate Limits & Pricing</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              ANCI operates on a credit system. <strong>1 Session = 1 Credit.</strong> A session allows for unlimited back-and-forth chat messages until the deal is closed or abandoned.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium">
              <li><strong>Free Tier:</strong> Every new organization receives <span className="text-emerald-600 font-bold">5,000 free credits</span> upon registration.</li>
              <li><strong>Rate Limit:</strong> 50 session creation requests per minute per IP.</li>
              <li><strong>Cost:</strong> Once your free tier is exhausted, credits are billed at $0.05 per session.</li>
            </ul>
          </section>

          {/* 2. QUICKSTART & END-TO-END */}
          <section id="quickstart" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Quickstart Guide</h2>
            <div className="space-y-6 mb-12">
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
                  <h4 className="font-bold text-slate-900 text-lg">Embed the Widget & Listen for Events (Frontend)</h4>
                  <p className="text-slate-600 text-sm mt-1">Pass the `sessionId` to the widget, listen for the `ANCI_DEAL_CLOSED` event, and add the product to your cart.</p>
                </div>
              </div>
            </div>

            {/* 🔥 END TO END EXAMPLE */}
            <h3 id="end-to-end" className="text-lg font-bold text-slate-800 mb-2">The End-to-End Example</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Here is the complete conceptual integration flow, from the moment a user clicks your button to the moment the order is created in your cart.
            </p>
            <CodeBlock code={endToEndCode} language="JavaScript (Conceptual Flow)" />
          </section>

          {/* 3. BACKEND API REFERENCE */}
          <section id="create-session" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">3. Backend API Reference</h2>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs tracking-wider uppercase">POST</span>
              /api/sessions/create
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">Initializes a secure vault session for a specific product negotiation.</p>

            <CodeBlock code={createSessionCode} language="Node.js Request" />
            
            {/* 🔥 RESPONSE SCHEMA */}
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 mt-6">Response Schema (201 Created)</h4>
            <CodeBlock code={createSessionResponse} language="JSON" />

            {/* 🔥 ERROR HANDLING */}
            <h3 id="errors" className="text-xl font-bold text-slate-900 mb-3 mt-12">Error Handling</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              ANCI uses standard HTTP response codes to indicate the success or failure of an API request.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium mb-4">
              <li><strong className="text-slate-900">400 Bad Request:</strong> Missing required parameters (e.g., basePrice).</li>
              <li><strong className="text-slate-900">401 Unauthorized:</strong> Missing or invalid `anci_live_` API key.</li>
              <li><strong className="text-slate-900">402 Payment Required:</strong> API credit limit reached.</li>
              <li><strong className="text-slate-900">429 Too Many Requests:</strong> Rate limit exceeded.</li>
            </ul>
            <CodeBlock code={errorCode} language="JSON (Error Schema)" />
          </section>

          {/* 4. FRONTEND & WEBHOOKS */}
          <section id="widget" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Frontend Integration & Events</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Pass your generated `sessionId` to the embedded iframe to start the chat.
            </p>
            <CodeBlock code={embedCode} language="HTML" />

            {/* 🔥 WEBHOOK / EVENT PAYLOAD */}
            <h3 id="events" className="text-xl font-bold text-slate-900 mb-3 mt-12">Checkout Event Payload</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              When the deal closes, the iframe emits a `postMessage` event containing the strict JSON payload below. Listen for this event to finalize the checkout.
            </p>
            <CodeBlock code={checkoutPayload} language="JSON (Event Payload)" />
            <CodeBlock code={checkoutCode} language="JavaScript (Event Listener)" />
          </section>

          {/* SUPPORT */}
          <section className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Help & Support</h2>
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
