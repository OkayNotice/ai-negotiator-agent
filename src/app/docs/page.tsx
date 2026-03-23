"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
// ⚠️ WARNING: This code must run on your BACKEND (e.g. Node.js, Next.js API route, Python)
// Never run this in the user's browser, or your API key will be stolen.

const response = await fetch("https://your-anci-domain.com/api/sessions/create", {
  method: "POST",
  headers: {
    "Authorization": "Bearer anci_live_YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    productName: "MacBook Pro M3",
    merchantProductId: "sku_9982",
    basePrice: 1200,   // Your secret absolute minimum acceptable price
    ceilingPrice: 1800 // The initial asking price the AI will anchor to
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
  height="450px" 
  style="border: none; border-radius: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
</iframe>
  `;

  const checkoutCode = `
// Listen for events emitted by the embedded ANCI Chat Widget iframe
window.addEventListener("message", (event) => {
  // Security Best Practice: Verify the origin matches your ANCI domain
  // if (event.origin !== "https://your-anci-domain.com") return;

  if (event.data?.action === "ANCI_DEAL_CLOSED") {
    const payload = event.data.payload;
    
    console.log("Session:", payload.sessionId);
    console.log("Product:", payload.productId);
    console.log("Final Negotiated Price: $", payload.finalPrice);

    // TODO: Add the item to your shopping cart using your platform's API
    // e.g., addToCart(payload.productId, payload.finalPrice);
    
    // Redirect the user to checkout to finalize the payment
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
// 1. User clicks "Negotiate Price" on your product page
async function handleNegotiateClick(product) {
  
  // 2. Your backend securely creates the ANCI session without exposing prices
  const sessionData = await fetch('/api/your-internal-backend/create-anci-session', {
    method: 'POST', body: JSON.stringify(product)
  }).then(res => res.json());

  // 3. You display the ANCI widget iframe using the returned Session ID
  openAnciModal(sessionData.sessionId);
}

// 4. Listen for the deal to successfully close
window.addEventListener("message", (event) => {
  if (event.data?.action === "ANCI_DEAL_CLOSED") {
    // 5. Add the item to the cart at the new, lower price & redirect to payment
    addToCart(event.data.payload.productId, event.data.payload.finalPrice);
    window.location.href = "/checkout";
  }
});
  `;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 flex flex-col">

      {/* Dynamic Header Component */}
      <Header />

      <div className="flex max-w-7xl mx-auto w-full flex-1">

        {/* Left Sidebar - Stays hidden on mobile to prioritize main content */}
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
        <main className="flex-1 px-6 py-12 md:px-12 max-w-4xl pb-32">

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">ANCI API Documentation</h1>
            {/* 🔥 KILLER POSITIONING LINE */}
            <p className="text-xl md:text-2xl font-bold text-emerald-600 mb-4 leading-tight">
              ANCI lets your app negotiate prices automatically and close deals in real time.
            </p>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              The complete guide to integrating the Conversational Commerce Engine. Maximize margins, automate haggling, and convert browsers into buyers securely.
            </p>

            {/* SDK Helper Mention */}
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-bold tracking-wide border border-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              Coming Soon: Official Node.js & React SDKs
            </div>
          </div>

          {/* 1. OVERVIEW */}
          <section id="introduction" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">1. Overview</h2>
            <h3 id="architecture" className="text-lg font-bold text-slate-800 mb-2 mt-8">The Architecture (Just-In-Time Vaults)</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              To keep your data safe, ANCI uses a Just-In-Time architecture. We do not require you to upload your entire product catalog to our servers. Instead, at the exact moment a customer clicks "Negotiate", your backend securely pings the ANCI API with your secret floor and ceiling prices. ANCI locks these in a vault and returns a secure `sessionId` token to pass to the frontend widget. <strong>Your secret prices never touch the frontend browser.</strong>
            </p>

            {/* 🔥 RATE LIMITS & PRICING */}
            <h3 id="pricing" className="text-lg font-bold text-slate-800 mb-2 mt-8">Rate Limits & Pricing</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              ANCI operates on a straightforward credit system. <strong>1 Session = 1 Credit.</strong> A single session allows for unlimited back-and-forth chat messages between the AI and the customer until the deal is either closed or abandoned.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 font-medium">
              <li><strong>Free Tier:</strong> Every new organization receives <span className="text-emerald-600 font-bold">5,000 free credits</span> upon registration to test the integration.</li>
              <li><strong>Rate Limit:</strong> Your API key is limited to 50 session creation requests per minute per IP to prevent spam.</li>
              <li><strong>Cost:</strong> Once your free tier is exhausted, additional credits are billed at $0.05 per session.</li>
            </ul>
          </section>

          {/* 2. QUICKSTART & END-TO-END */}
          <section id="quickstart" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">2. Quickstart Guide</h2>
            <div className="space-y-8 mb-12">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">1</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Get your API Key</h4>
                  <p className="text-slate-600 text-sm md:text-base mt-1">Navigate to the Developer Dashboard, register your organization, and copy your secure <code>anci_live_</code> key.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">2</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Initialize a Session (Backend)</h4>
                  <p className="text-slate-600 text-sm md:text-base mt-1">When a user wants to negotiate, have your server call <code>POST /sessions/create</code> to lock in your hidden prices and receive a unique <code>sessionId</code>.</p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold flex-shrink-0 text-lg">3</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Embed the Widget & Listen for Events (Frontend)</h4>
                  <p className="text-slate-600 text-sm md:text-base mt-1">Pass the <code>sessionId</code> into the widget iframe. Set up a listener for the <code>ANCI_DEAL_CLOSED</code> javascript event to catch the final price and add the product to your cart.</p>
                </div>
              </div>
            </div>

            {/* 🔥 END TO END EXAMPLE */}
            <h3 id="end-to-end" className="text-xl font-bold text-slate-800 mb-3">The End-to-End Example</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              Here is the complete conceptual workflow, from the moment a user clicks your negotiation button to the moment the order is ready for checkout.
            </p>
            <CodeBlock code={endToEndCode} language="JavaScript (Conceptual Flow)" />
          </section>

          {/* 3. BACKEND API REFERENCE */}
          <section id="create-session" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">3. Backend API Reference</h2>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs tracking-wider uppercase">POST</span>
              /api/sessions/create
            </h3>
            <p className="text-slate-600 leading-relaxed mb-6">Initializes a secure vault session for a specific product negotiation. This must be called securely from your backend server.</p>

            <CodeBlock code={createSessionCode} language="Node.js Request" />

            {/* 🔥 RESPONSE SCHEMA */}
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 mt-6">Response Schema (201 Created)</h4>
            <CodeBlock code={createSessionResponse} language="JSON" />

            {/* 🔥 ERROR HANDLING */}
            <h3 id="errors" className="text-xl md:text-2xl font-bold text-slate-900 mb-4 mt-12">Error Handling</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              ANCI uses standard HTTP response codes to indicate the success or failure of an API request.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <ul className="space-y-4 text-slate-600 font-medium text-sm md:text-base">
                <li className="flex items-start gap-3">
                  <strong className="text-slate-900 whitespace-nowrap">400 Bad Request:</strong> 
                  <span>Missing required parameters (e.g., basePrice or ceilingPrice).</span>
                </li>
                <li className="flex items-start gap-3">
                  <strong className="text-slate-900 whitespace-nowrap">401 Unauthorized:</strong> 
                  <span>Missing or invalid `anci_live_` API key.</span>
                </li>
                <li className="flex items-start gap-3">
                  <strong className="text-slate-900 whitespace-nowrap">402 Payment Required:</strong> 
                  <span>Your organization's API credit limit has been reached. Please upgrade your plan.</span>
                </li>
                <li className="flex items-start gap-3">
                  <strong className="text-slate-900 whitespace-nowrap">429 Too Many Requests:</strong> 
                  <span>Rate limit exceeded (Maximum 50 per minute).</span>
                </li>
              </ul>
            </div>
            <CodeBlock code={errorCode} language="JSON (Error Schema)" />
          </section>

          {/* 4. FRONTEND & WEBHOOKS */}
          <section id="widget" className="mb-16 pt-8 border-t border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">4. Frontend Integration & Events</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Pass your generated `sessionId` to the embedded iframe to start the chat. The iframe is naturally responsive and will expand to fill the width of its container. For mobile views, ensure the parent container allows full width.
            </p>
            <CodeBlock code={embedCode} language="HTML" />

            {/* 🔥 WEBHOOK / EVENT PAYLOAD */}
            <h3 id="events" className="text-xl md:text-2xl font-bold text-slate-900 mb-3 mt-12">Checkout Event Payload</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              When the AI and the customer successfully agree on a price, the iframe emits a standard browser `postMessage` event containing the strict JSON payload below. Your frontend application must listen for this event to retrieve the final negotiated price and proceed with checkout.
            </p>
            <CodeBlock code={checkoutPayload} language="JSON (Event Payload)" />
            <CodeBlock code={checkoutCode} language="JavaScript (Event Listener)" />
          </section>

        </main>
      </div>

      {/* Dynamic Footer Component */}
      <Footer />

    </div>
  );
}
