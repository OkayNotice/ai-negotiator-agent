"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget({ productId }: { productId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! I'm your AI merchant. What's your offer?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dealClosed, setDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || dealClosed) return;

    const userOffer = parseFloat(input.replace(/[^0-9.]/g, ''));
    if (isNaN(userOffer)) {
      alert("Please enter a valid number.");
      return;
    }

    const newMessages: Message[] = [...messages, { role: "user", content: `$${userOffer.toLocaleString()}` }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          sessionId: "session-123", 
          userOffer: userOffer,
          chatHistory: newMessages.slice(1).map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Connection interrupted. Let's try that again." }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.aiMessage }]);
        if (data.dealClosed) {
          setDealClosed(true);
          setFinalPrice(data.finalPrice);
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-[450px]">
      
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">Live Negotiation</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">ANCI Engine</span>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-5 overflow-y-auto bg-white flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user" 
                  ? "bg-slate-900 text-white rounded-br-sm" 
                  : "bg-slate-100 text-slate-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="bg-slate-100 text-slate-500 px-4 py-3 rounded-2xl rounded-bl-sm text-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {!dealClosed ? (
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-400 font-medium">$</span>
            <input
              type="text"
              inputMode="decimal"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Make an offer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-8 pr-12 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </div>
        ) : (
          <button className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-semibold shadow-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
            <span>Pay ${finalPrice?.toLocaleString()} Now</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
