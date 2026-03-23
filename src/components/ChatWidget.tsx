"use client";

import { useState, useEffect, useRef } from "react";

type Message = { role: "user" | "assistant"; content: string; };

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dealClosed, setDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // 🔥 THE FIX: We reference the scrollable container, not an invisible div
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      // This scrolls ONLY the internal chat box, not the whole webpage!
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const initializeVaultSession = async () => {
      try {
        const ceiling = 15000;
        
        const res = await fetch("/api/sessions/create", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer sk_test_12345" },
          body: JSON.stringify({
            productName: "ANCI Enterprise License",
            merchantProductId: "demo_001",
            basePrice: 10000,
            ceilingPrice: ceiling
          })
        });
        const data = await res.json();
        
        if (data.sessionId) {
          setSessionId(data.sessionId);
          setMessages([{ 
            role: "assistant", 
            content: `The normal price for this is $${ceiling.toLocaleString()}, but I can reduce it for you if you feel like the price is high. Make me an offer! 😉` 
          }]);
        }
      } catch (error) {
        console.error("Failed to initialize session vault.");
      }
    };
    initializeVaultSession();
  }, []);

  const handleSend = async () => {
    const userMessage = input.trim();
    if (!userMessage || dealClosed || !sessionId) return;

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId, 
          userMessage, 
          chatHistory: newMessages.slice(1).map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.aiMessage }]);
        if (data.dealClosed) {
          setDealClosed(true);
          setFinalPrice(data.finalPrice);
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutHandoff = () => {
    window.parent.postMessage({ action: "ANCI_DEAL_CLOSED", payload: { sessionId, productId: "demo_001", finalPrice } }, "*");
    alert(`📢 Handoff Complete!\n\nPrice: $${finalPrice}\n\nThe merchant's code will now add this to their cart!`);
  };

  return (
    <div className="w-full flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[450px]">
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">Live Demo</h3>
        </div>
        {!sessionId ? (
          <span className="text-xs text-amber-500 font-bold animate-pulse">Connecting...</span>
        ) : (
          <span className="text-xs text-slate-400 font-medium font-mono border px-2 py-0.5 rounded bg-white">
            {sessionId.substring(0, 10)}...
          </span>
        )}
      </div>

      {/* 🔥 THE FIX: We put the ref directly on this container */}
      <div 
        ref={chatContainerRef} 
        className="flex-1 p-5 overflow-y-auto bg-white flex flex-col gap-4"
      >
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed font-medium ${
                msg.role === "user" ? "bg-slate-900 text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm"
              }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        {!dealClosed ? (
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your offer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 pr-12 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              disabled={isLoading || !sessionId}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || !sessionId}
              className="absolute right-2 bg-slate-900 text-white p-2 rounded-lg shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" /></svg>
            </button>
          </div>
        ) : (
          <button 
            onClick={handleCheckoutHandoff}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout (${finalPrice?.toLocaleString()})</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        )}
      </div>
    </div>
  );
}
