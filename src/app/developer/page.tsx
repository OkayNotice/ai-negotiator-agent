// src/app/developer/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase-client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></span>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        </div>
      </div>
    );
  }

  // --- LOGGED OUT VIEW ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 w-full max-w-md relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white mb-4 shadow-md">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Developer Portal</h1>
              <p className="text-slate-500 text-sm font-medium mt-2">Sign in to manage your API keys and view live negotiations.</p>
            </div>
            
            <div className="space-y-4 relative z-10">
              <input className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all" type="email" placeholder="Work Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            
            <div className="flex gap-3 mt-8 relative z-10">
              <button onClick={() => handleAuth(false)} className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-all">Log In</button>
              <button onClick={() => handleAuth(true)} className="flex-1 bg-white border border-slate-200 text-slate-900 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">Sign Up</button>
            </div>

            <p className="text-center text-xs text-slate-400 mt-6 font-medium">New accounts receive 5,000 free API credits.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- LOGGED IN VIEW (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-100">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        
        {/* Account Control Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Command Center</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Logged in as {user.email}</p>
          </div>
          <button onClick={() => signOut(auth)} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 hover:text-red-600 transition-all self-start md:self-auto">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>

        {!merchantData ? (
          /* ONBOARDING: Generate Key State */
          <div className="bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-slate-200 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight">Initialize your Workspace</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed max-w-md mx-auto">
              Enter your organization or app name below to generate your production API key and unlock your 5,000 free negotiation credits.
            </p>
            <div className="max-w-sm mx-auto">
              <input className="w-full mb-4 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center" type="text" placeholder="e.g. Kabale Online" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              <button onClick={handleGenerateKey} disabled={!companyName.trim()} className="w-full bg-slate-900 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all">
                Generate Production Key
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Links Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               <Link href="/docs#quickstart" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm transition-all flex items-center gap-3 group">
                 <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-slate-900">Quickstart</h3>
                   <p className="text-xs font-medium text-slate-500">5 min setup guide</p>
                 </div>
               </Link>
               <Link href="/docs" className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all flex items-center gap-3 group">
                 <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-slate-900">API Docs</h3>
                   <p className="text-xs font-medium text-slate-500">Endpoints & Payloads</p>
                 </div>
               </Link>
            </div>

            {/* API Keys & Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Key Vault */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Secret API Key</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Pass this in the Authorization header of your server requests.</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-emerald-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </div>
                <div className="relative group">
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-inner">
                    <div className="px-5 py-4 font-mono text-sm text-slate-800 flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide">
                      {showKey ? merchantData.apiKey : "anci_live_••••••••••••••••••••••••••••••••••••••••••"}
                    </div>
                    <button onClick={() => setShowKey(!showKey)} className="p-4 text-slate-400 hover:text-slate-600 transition-colors border-l border-slate-200 bg-white" title={showKey ? "Hide Key" : "Show Key"}>
                      {showKey ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                    <button onClick={copyToClipboard} className="p-4 text-slate-400 hover:text-slate-600 transition-colors border-l border-slate-200 bg-white flex items-center justify-center w-14" title="Copy to Clipboard">
                      {copied ? <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                    </button>
                  </div>
                </div>
              </div>

              {/* API Credits */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-800 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[80px] opacity-20 -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{merchantData.companyName}</h2>
                  <p className="text-sm font-medium text-slate-300 mb-8">Active Organization</p>
                  
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Available Credits</h2>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-extrabold text-white tracking-tight">{merchantData.apiCredits?.toLocaleString()}</p>
                    <span className="text-sm font-bold text-emerald-400">/ Sessions</span>
                  </div>
                </div>
                
                <button onClick={() => alert('Billing portal integration coming next!')} className="w-full mt-8 bg-white/10 hover:bg-white/20 border border-white/10 text-white py-2.5 rounded-xl text-sm font-bold transition-all backdrop-blur-sm relative z-10">
                  Add Credits
                </button>
              </div>
            </div>

            {/* Negotiation History Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Negotiation Pipeline</h2>
                  <p className="text-sm text-slate-500 font-medium">Live view of active and closed deals.</p>
                </div>
                <button onClick={() => window.location.reload()} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-white border-b border-slate-200 text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                      <th className="px-8 py-4">Product Name</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4">Floor Price</th>
                      <th className="px-8 py-4 text-emerald-600">Final / Top Offer</th>
                      <th className="px-8 py-4 text-right">Date Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-16 text-center">
                          <div className="inline-flex w-16 h-16 bg-slate-50 border border-slate-100 rounded-full items-center justify-center text-slate-300 mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 mb-1">No negotiations yet</h3>
                          <p className="text-sm text-slate-500 font-medium">Embed the widget and start a chat to see data flow here.</p>
                        </td>
                      </tr>
                    ) : (
                      sessions.map((session) => (
                        <tr key={session.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-8 py-5 text-sm font-bold text-slate-900">{session.productName}</td>
                          <td className="px-8 py-5">
                            {session.status === 'closed_won' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Won
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-wider border border-amber-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Active
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-500 font-mono">${session.basePrice?.toLocaleString()}</td>
                          <td className="px-8 py-5 text-sm font-bold text-emerald-600 font-mono bg-emerald-50/30 group-hover:bg-emerald-50/50 transition-colors">
                            ${(session.finalDealPrice || session.lastOffer || 0).toLocaleString()}
                          </td>
                          <td className="px-8 py-5 text-sm text-slate-500 font-medium text-right">
                            {new Date(session.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
