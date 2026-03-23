"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-2xl tracking-tighter text-slate-900">
          ANCI.
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/docs" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
          <a href="https://github.com/YOUR_GITHUB_USERNAME/ai-negotiator-agent" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">GitHub</a>
          <a href="mailto:shopkabale@gmail.com" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Support</a>
          <Link href="/developer" className="text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all">
            Dashboard
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-slate-600 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between items-center">
            <span className={`h-0.5 w-full bg-slate-900 rounded-full transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
            <span className={`h-0.5 w-full bg-slate-900 rounded-full transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`h-0.5 w-full bg-slate-900 rounded-full transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-64 opacity-100 pt-4 pb-2 mt-4 border-t border-slate-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col space-y-4 px-2">
          <Link href="/docs" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-slate-600">Docs</Link>
          <a href="https://github.com/YOUR_GITHUB_USERNAME/ai-negotiator-agent" target="_blank" className="text-sm font-semibold text-slate-600">GitHub</a>
          <a href="mailto:shopkabale@gmail.com" className="text-sm font-semibold text-slate-600">Support</a>
          <Link href="/developer" onClick={() => setIsOpen(false)} className="text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">Go to Dashboard →</Link>
        </div>
      </div>
    </nav>
  );
}
