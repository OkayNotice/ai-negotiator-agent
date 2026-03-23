// src/app/developer/page.tsx
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
  const [sessions, setSessions] = useState<any[]>([]);
  
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch API Key Data
        const res = await fetch(`/api/developer?uid=${currentUser.uid}`);
        const data = await res.json();
        setMerchantData(data.merchant || null);

        // Fetch Negotiation History
        if (data.merchant) {
          const historyRes = await fetch(`/api/sessions/history?uid=${currentUser.uid}`);
          const historyData = await historyRes.json();
          if (historyData.sessions) setSessions(historyData.sessions);
        }
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

      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-8">
        {!merchantData ? (
          /* Generate Key State */
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 max-w-xl">
            <h2 className="text-2xl font-bold mb-2 text-slate-900">Initialize your App</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">Enter your organization name to generate your production API keys.</p>
            <input className="w-full mb-4 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900" type="text" placeholder="e.g. Acme Corp" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <button onClick={handleGenerateKey} disabled={!companyName.trim()} className="w-full bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50">Generate Production Key</button>
          </div>
        ) : (
          <>
            {/* API Keys & Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <button onClick={() => setShowKey(!showKey)} className="p-3 text-slate-400 hover:text-slate-600 transition-colors border-l border-slate-200 bg-white">
                      {showKey ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                    <button onClick={copyToClipboard} className="p-3 text-slate-400 hover:text-slate-600 transition-colors border-l border-slate-200 bg-white flex items-center justify-center w-12">
                      {copied ? <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 text-white flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Organization</h2>
                  <p className="text-lg font-bold mb-6">{merchantData.companyName}</p>
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">API Credits</h2>
                  <p className="text-4xl font-extrabold text-emerald-400 tracking-tight">{merchantData.apiCredits?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Negotiation History Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">Recent Negotiations</h2>
                <p className="text-sm text-slate-500 font-medium">Live pipeline of active and closed deals.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                      <th className="px-8 py-4">Product</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Floor Price</th>
                      <th className="px-8 py-4">Final / Last Offer</th>
                      <th className="px-8 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-medium">
                          No negotiations yet. Start a chat in the demo widget!
                        </td>
                      </tr>
                    ) : (
                      sessions.map((session) => (
                        <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5 text-sm font-semibold text-slate-900">{session.productName}</td>
                          <td className="px-8 py-5">
                            {session.status === 'closed_won' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Won
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Active
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-500 font-medium">${session.basePrice?.toLocaleString()}</td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-900">
                            ${(session.finalDealPrice || session.lastOffer || 0).toLocaleString()}
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-500">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
