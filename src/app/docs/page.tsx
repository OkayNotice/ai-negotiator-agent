"use client";

import { useState } from "react";
import Link from "next/link";

// 🛠️ The Reusable Copyable Code Block Component
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-sm my-6 border border-slate-800">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/50 border-b border-slate-800">
        <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">{language}</span>
        <button 
          onClick={handleCopy} 
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 hover:border-slate-500"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span className="text-xs font-bold text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <span className="text-xs font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code Area */}
      <div className="p-4 overflow-x-auto scrollbar-hide">
        <pre className="text-sm text-emerald-400 font-mono whitespace-pre leading-relaxed">{code.trim()}</pre>
      </div>
    </div>
  );
};

export default function Documentation() {
  // A sample snippet to test the copy feature!
  const createSessionCode = `
const response = await fetch("https://api.anci.com/v1/sessions/create", {
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
console.log(data.sessionId); // Use this token in the frontend!
  `;

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
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Getting Started</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#overview" className="hover:text-emerald-600 transition-colors text-emerald-600">Overview</Link></li>
                <li><Link href="#architecture" className="hover:text-emerald-600 transition-colors">The Architecture</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">API Reference</h4>
              <ul className="space-y-2.5 text-sm font-medium text-slate-500">
                <li><Link href="#create-session" className="hover:text-emerald-600 transition-colors">POST /sessions/create</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-6 py-12 md:px-12 max-w-3xl">
          
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">ANCI API Documentation</h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Learn how to integrate the ANCI Conversational Commerce Engine into your application.
            </p>
          </div>

          <hr className="border-slate-200 mb-12" />

          {/* Overview Section */}
          <section id="overview" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              ANCI is a Just-In-Time negotiation API. Instead of syncing your entire product database with our servers, your backend simply creates a secure "Vault Session" at the exact moment a user wants to negotiate.
            </p>
          </section>

          {/* Create Session Section (Now with Copyable Code!) */}
          <section id="create-session" className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Initialize a Vault Session</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Call this endpoint from your secure backend to lock in your secret floor and ceiling prices. This will return a <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-200">sessionId</code> which you can safely pass to your frontend widget.
            </p>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded text-xs tracking-wider uppercase">POST</span>
              <code className="text-slate-900 font-bold text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200">/api/sessions/create</code>
            </div>

            {/* 🔥 The Magic Copyable Block */}
            <CodeBlock code={createSessionCode} language="JavaScript (Node.js)" />

          </section>

        </main>
      </div>
    </div>
  );
}
