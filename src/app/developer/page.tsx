// src/app/developer/page.tsx
"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase-client";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

export default function DeveloperPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [merchantData, setMerchantData] = useState<any>(null);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch their API key data
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // --- LOGGED OUT VIEW ---
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-slate-900">Developer Login</h1>
          <input className="w-full mb-4 px-4 py-2 border rounded-lg text-slate-900" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full mb-6 px-4 py-2 border rounded-lg text-slate-900" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex gap-4">
            <button onClick={() => handleAuth(false)} className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800">Log In</button>
            <button onClick={() => handleAuth(true)} className="flex-1 bg-white border border-slate-300 text-slate-900 py-2 rounded-lg font-medium hover:bg-slate-50">Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN VIEW (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">API Dashboard</h1>
          <button onClick={() => signOut(auth)} className="text-sm text-slate-500 hover:text-slate-900">Sign Out</button>
        </div>

        {!merchantData ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-2 text-slate-900">Create your App</h2>
            <p className="text-slate-500 text-sm mb-6">Enter your organization name to generate your API keys.</p>
            <input className="w-full mb-4 px-4 py-3 border rounded-lg text-slate-900" type="text" placeholder="Organization Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            <button onClick={handleGenerateKey} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700">Generate Secret Key</button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Organization</h2>
              <p className="text-xl font-medium text-slate-900">{merchantData.companyName}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Secret API Key</h2>
              <code className="block bg-slate-100 p-4 rounded-lg text-slate-800 border font-mono text-sm break-all">
                {merchantData.apiKey}
              </code>
              <p className="text-xs text-amber-600 mt-2 font-medium">Keep this key secret. Do not expose it in client-side code.</p>
            </div>
            <div className="pt-6 border-t">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">API Credits</h2>
              <p className="text-2xl font-bold text-emerald-600">{merchantData.apiCredits.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
