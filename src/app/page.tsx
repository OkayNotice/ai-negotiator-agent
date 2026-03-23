"use client";

import { useState, useEffect } from "react";
import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";
import { auth } from "@/lib/firebase-client";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      
      {/* Smart Navigation Bar */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-extrabold text-2xl tracking-tighter text-slate-900">ANCI.</div>
        
        <div className="flex items-center gap-6">
          {/* Only show buttons once Firebase confirms auth status to prevent layout shift */}
          {authLoaded && (
            user ? (
              <Link href="/developer" className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-slate-800 transition-all">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/developer" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
                  Developer Login
                </Link>
                <Link href="/developer" className="text-sm font-bold bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-slate-800 transition-all">
                  Get API Key
                </Link>
              </>
            )
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-grow">
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
                Mathematical Guardrails
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Secure Multi-Tenant Architecture
              </div>
            </div>
          </div>

          {/* Right Side: Widget Demo */}
          <div className="w-full max-w-md mx-auto relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative">
              <ChatWidget />
            </div>
          </div>
        </div>
      </div>

      {/* The Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-10 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tighter text-xl text-slate-900">ANCI.</span>
            <span className="text-slate-400 text-sm font-medium">© 2026</span>
          </div>
          
          <div className="flex gap-8 text-sm font-semibold text-slate-500">
            <Link href="#" className="hover:text-slate-900 transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            {/* Directs support queries to your specific admin email */}
            <Link href="mailto:shopkabale@gmail.com" className="hover:text-slate-900 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
