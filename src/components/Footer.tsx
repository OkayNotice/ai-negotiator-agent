import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-900 font-extrabold text-xl tracking-tighter">ANCI.</div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500">
          {/* 🔥 This now perfectly links to your new /docs page */}
          <Link href="/docs" className="hover:text-slate-900 transition-colors">Documentation</Link>
          
          <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
          <a href="https://github.com/YOUR_GITHUB_USERNAME/ai-negotiator-agent" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">Open Source (GitHub)</a>
          <a href="mailto:shopkabale@gmail.com" className="hover:text-slate-900 transition-colors">Contact Support</a>
        </div>
        
        <div className="text-xs text-slate-400 font-medium">
          © {new Date().getFullYear()} ANCI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
