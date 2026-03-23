import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-600 mb-2">🟢 ANCI Storefront</h1>
        <p className="text-gray-600 mb-8">Click below to negotiate the price of our premium software package.</p>
        
        {/* Product Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">ANCI Enterprise License</h2>
          <p className="text-gray-600 mb-4">Unlimited API calls, dedicated support, and advanced analytics.</p>
          
          <div className="bg-gray-100 inline-block px-3 py-1 rounded text-sm text-gray-500 font-medium mb-6">
            Price: Hidden (Negotiable)
          </div>

          {/* Mount the Chat Widget here. We pass a mock product ID for now */}
          <ChatWidget productId="prod_enterprise_001" />
        </div>
      </div>
    </main>
  );
}
