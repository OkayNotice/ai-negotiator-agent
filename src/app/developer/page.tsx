"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase-client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

export default function DeveloperPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [merchantData, setMerchantData] = useState<any>(null);
  
  // UI States for the API Key
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const res = await fetch(`/api/developer?uid=${currentUser.uid}`);
        const data = await res.json();
        setMerchantData(data.merchant || null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (isSignUp: boolean) => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      alert("Auth Error: " + error.message);
    }
  };

  const handleGenerateKey = async () => {
    if (!user || !companyName) return;
    try {
      const res = await fetch("/api/developer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email, companyName }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setMerchantData(data.merchant);
      }
    } catch (error) {
      alert("Failed to generate key.");
    }
  };

  const copyToClipboard = () => {
    if (!merchantData?.apiKey) return;
    navigator.clipboard.writeText(merchantData.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex gap-2 items-center text-slate-500 font-medium">
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
          <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        </div>
      </div>
    );
  }

  // --- LOGGED OUT VIEW ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans selection:bg-slate-200">
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Storefront
        </Link>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ANCI Developer</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Sign in to manage your API keys.</p>
          </div>
          
          <div className="space-y-4">
            <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" type="email" placeholder="Developer Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => handleAuth(false)} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-all">Log In</button>
            <button onClick={() => handleAuth(true)} className="flex-1 bg-white border border-slate-200 text-slate-900 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN VIEW (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-200 pb-20">
      
      {/* Dashboard Nav */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-slate-400 hover:text-slate-900 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div className="font-extrabold text-xl tracking-tighter text-slate-900">ANCI Dashboard</div>
        </div>
        <button onClick={() => signOut(auth)} className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2">
          <span>Log Out</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-12">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your organization's API credentials and usage.</p>
        </div>

        {!merchantData ? (
          /* Generate Key State */
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 max-w-xl">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Initialize your App</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">Enter your organization name to generate your production API keys and claim your 5,000 free credits.</p>
            <input className="w-full mb-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900" type="text" placeholder="e.g. Acme Corp" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <button onClick={handleGenerateKey} disabled={!companyName.trim()} className="w-full bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-all">Generate Production Key</button>
          </div>
        ) : (
          /* Active Dashboard State */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* API Key Panel (Takes up 2 columns) */}
            <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Secret API Key</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Authenticate your server requests.</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-100">Live</span>
              </div>

              <div className="relative group">
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3.5 font-mono text-sm text-slate-800 flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {showKey ? merchantData.apiKey : "••••••••••••••••••••••••••••••••••••••••••••••••••"}
                  </div>
                  
                  {/* Toggle Visibility Button */}
                  <button onClick={() => setShowKey(!showKey)} className="p-3 text-slate-400 hover:text-slate-600 transition-colors border-l border-slate-200 bg-white">
                    {showKey ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>

                  {/* Copy Button */}
                  <button onClick={copyToClipboard} className="p-3 text-slate-400 hover:text-slate-600 transition-colors border-l border-slate-200 bg-white flex items-center justify-center w-12">
                    {copied ? (
                      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Do not share your API key in publicly accessible areas such as GitHub or client-side code.
              </p>
            </div>

            {/* Metrics Panel */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Organization</h2>
                <p className="text-lg font-bold mb-8">{merchantData.companyName}</p>
                
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Available Credits</h2>
                <p className="text-4xl font-extrabold text-emerald-400 tracking-tight">{merchantData.apiCredits.toLocaleString()}</p>
              </div>
              
              <div className="pt-6 border-t border-slate-700/50 mt-8">
                <Link href="/" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                  Read the Docs
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
