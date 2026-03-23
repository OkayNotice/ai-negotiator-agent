import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-16 md:py-24">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          <div className="mb-10 border-b border-slate-100 pb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-slate-500 font-medium">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-8 text-slate-600 leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the ANCI Conversational Commerce Engine API, Chat Widget, and Developer Portal (collectively, the "Service"), you agree to be bound by these Terms of Service. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. API Usage and Credits</h2>
              <p className="mb-3">
                ANCI operates on a usage-based credit system. One (1) API Credit is consumed each time a new negotiation session is initialized via the <code>/sessions/create</code> endpoint. 
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>New organizations receive a promotional tier of free credits upon registration.</li>
                <li>Once promotional credits are exhausted, continued use of the API requires a valid payment method.</li>
                <li>We reserve the right to throttle or suspend API access if your account exceeds reasonable rate limits (50 requests per minute) or engages in abusive behavior.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Data Security & Just-In-Time Vaults</h2>
              <p>
                ANCI utilizes a Just-In-Time (JIT) architecture. We do not permanently store your product catalogs. Floor and ceiling prices passed to our API are encrypted and stored in temporary session vaults strictly for the duration of the active negotiation. It is your responsibility to keep your <code>anci_live_</code> API keys secure and never expose them in client-side code.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Limitation of Liability</h2>
              <p>
                The ANCI API utilizes advanced Artificial Intelligence (Large Language Models) to negotiate on your behalf. While we have implemented strict mathematical guardrails to prevent the AI from quoting prices below your specified floor, ANCI is provided "AS IS". We are not liable for any lost revenue, pricing errors, or indirect damages arising from the use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Contact and Support</h2>
              <p>
                If you have questions about these terms, need help with integration, or require a custom Enterprise Service Level Agreement (SLA), please reach out to our engineering team.
              </p>
              <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="font-bold text-slate-900">Email:</span> <a href="mailto:shopkabale@gmail.com" className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium">shopkabale@gmail.com</a>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
