"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";
import { auth } from "@/lib/firebase-client";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 🔥 Check if the user is already logged in!
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 flex flex-col overflow-x-hidden">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Copy & Demo Context */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide border border-emerald-200 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Multi-Currency & Multi-Language Support
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Stop losing sales to fixed prices.
            </h1>
            
            {/* 🔥 FIRST IMPRESSION: Stronger value proposition */}
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
              ANCI is a plug-and-play Conversational Commerce Engine. It negotiates with your customers in real-time, in their native language, and securely defends your profit margins.
            </p>

            {/* Feature Checkmarks */}
            <div className="flex flex-col gap-3 mb-10">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Auto-detects languages (English, Swahili, Mandarin, etc.)
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Set your custom currency (UGX, KSH, NGN, USD)
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Zero frontend exposure of your secret floor prices
              </div>
            </div>
            
            {/* 🔥 THE DEMO EXPLANATION BOX (Now perfectly matches UGX & Dell XPS) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 relative z-10">👇 Try the Live Demo</h3>
              <p className="text-sm text-slate-600 mb-4 relative z-10">
                Chat with the widget to buy a <strong>Dell XPS 15</strong>. The AI has been given the following secret constraints for this session:
              </p>
              <ul className="space-y-2 text-sm font-medium relative z-10">
                <li className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Starting Price (Ceiling)</span>
                  <span className="text-slate-900 font-bold font-mono">UGX 5,000,000</span>
                </li>
                <li className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-500">Secret Minimum (Floor)</span>
                  <span className="text-emerald-600 font-bold font-mono">UGX 4,200,000</span>
                </li>
              </ul>
              <p className="text-xs text-slate-400 mt-4 font-medium relative z-10">
                💡 Tip: Try offering <strong>4,300,000</strong> and see how it responds!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* 🔥 DYNAMIC CTA BUTTON */}
              {!isCheckingAuth && user ? (
                <Link href="/developer" className="bg-emerald-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 transition-all text-center flex-1 sm:flex-none flex items-center justify-center gap-2">
                  <span>Go to Dashboard</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              ) : (
                <Link href="/developer" className="bg-slate-900 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-all text-center flex-1 sm:flex-none">
                  Get Free API Key
                </Link>
              )}
              
              <Link href="/docs" className="bg-white border border-slate-200 text-slate-900 px-6 py-3.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all text-center flex-1 sm:flex-none">
                Read Documentation
              </Link>
            </div>
          </div>

          {/* Right Side: Widget */}
          <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-blue-50 blur-3xl opacity-50 -z-10 rounded-full"></div>
            <div className="transform hover:-translate-y-1 transition-transform duration-500">
              <ChatWidget />
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
