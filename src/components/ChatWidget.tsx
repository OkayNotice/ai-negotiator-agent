"use client";

import { useState } from "react";

// Define the structure of our chat messages
type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget({ productId }: { productId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! I'm ready to negotiate. What's your offer?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dealClosed, setDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const handleSend = async () => {
    if (!input.trim() || dealClosed) return;

    const userOffer = parseFloat(input);
    if (isNaN(userOffer)) {
      alert("Please enter a valid number for your offer.");
      return;
    }

    // Add user message to UI immediately
    const newMessages: Message[] = [...messages, { role: "user", content: `I offer $${userOffer}` }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Call your Layer 2 AI Brain
      const response = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId,
          sessionId: "session-123", // Hardcoded for testing
          userOffer: userOffer,
          chatHistory: newMessages.slice(1).map(m => ({
            role: m.role,
            content: m.content
          })) // Send history for AI memory
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Oops, my brain disconnected. Try again!" }]);
      } else {
        // Add AI response to UI
        setMessages((prev) => [...prev, { role: "assistant", content: data.aiMessage }]);
        
        if (data.dealClosed) {
          setDealClosed(true);
          setFinalPrice(data.finalPrice);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-gray-300 rounded-lg overflow-hidden flex flex-col mt-6 shadow-lg bg-white">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-4 font-bold text-center">
        Live Negotiation
      </div>

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto min-h-[300px] max-h-[400px] bg-gray-50 flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div key={index} className={`max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-emerald-100 self-end text-right text-emerald-900" : "bg-white border border-gray-200 self-start text-gray-800"}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="text-gray-400 text-sm self-start animate-pulse">AI is thinking...</div>}
      </div>

      {/* Input Area */}
      {!dealClosed ? (
        <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Enter your offer ($)..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-emerald-500 text-black"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      ) : (
        <div className="p-4 bg-green-100 border-t border-green-300 text-center">
          <p className="text-green-800 font-bold mb-2">🎉 Deal Closed at ${finalPrice}!</p>
          <button className="w-full bg-black text-white px-4 py-2 rounded font-bold shadow-md">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
