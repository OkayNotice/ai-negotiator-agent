import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { enforcePriceGuardrails } from '@/lib/guardrails';
import { db } from '@/lib/firebase-admin';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    // 🛡️ 1. API KEY VALIDATION (The SaaS Bouncer)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized. Missing API Key." }, { status: 401 });
    }
    
    const apiKey = authHeader.split('Bearer ')[1];

    // Look up the merchant by their API Key
    const merchantsSnapshot = await db.collection('merchants').where('apiKey', '==', apiKey).limit(1).get();
    
    if (merchantsSnapshot.empty) {
      return NextResponse.json({ error: "Invalid API Key." }, { status: 403 });
    }

    const merchant = merchantsSnapshot.docs[0];
    const merchantId = merchant.id;

    // 📦 2. READ REQUEST PAYLOAD
    const body = await request.json();
    const { productId, sessionId, userOffer, chatHistory = [] } = body;

    if (!productId || userOffer === undefined) {
      return NextResponse.json({ error: "Missing productId or userOffer." }, { status: 400 });
    }

    // 🔍 3. FETCH & VERIFY PRODUCT FROM FIREBASE
    const productRef = await db.collection('products').doc(productId).get();
    
    if (!productRef.exists) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const dbProduct = productRef.data() as { basePrice: number, ceilingPrice: number, merchantId: string };

    // Security Check: Does this product belong to the merchant who made the API call?
    if (dbProduct.merchantId !== merchantId) {
      return NextResponse.json({ error: "Product does not belong to this merchant." }, { status: 403 });
    }

    // 🧠 4. THE AI BRAIN (STRICT NEGOTIATOR PROMPT)
    const systemPrompt = `
      You are a strict, professional AI merchant for ANCI.
      Your goal is to get the highest price possible for the product.
      
      CRITICAL RULES:
      1. Your hidden absolute minimum price is ${dbProduct.basePrice}. NEVER say this exact number to the user unless they offer it first.
      2. Your starting anchor/ceiling price is ${dbProduct.ceilingPrice}. 
      3. If the user makes a low offer, YOU MUST REJECT IT and explicitly state a specific numerical counter-offer in your message. DO NOT be vague. DO NOT say "I need a higher price". Say something like "I can't do that, but I can offer $14,000."
      4. Always negotiate gradually down from your ceiling price. Do not drop to your minimum immediately.
      5. If the user's offer is ${dbProduct.basePrice} or higher, you may accept it.
      
      Respond in valid JSON format with exactly two keys:
      - "message": Your text response to the customer (MUST INCLUDE your specific counter-offer number with a $ sign if you are rejecting their offer).
      - "proposedPrice": The number value of your counter-offer (or accepted price).
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: `I offer $${userOffer}.` }
      ],
      temperature: 0.2, // Lowered to enforce strict mathematical logic and reduce "chatty/vague" behavior
    });

    const aiResponse = JSON.parse(completion.choices[0].message?.content || "{}");
    const rawAiPrice = aiResponse.proposedPrice || dbProduct.ceilingPrice;

    // 🛡️ 5. MATHEMATICAL GUARDRAILS
    let finalSafePrice = enforcePriceGuardrails(rawAiPrice, {
      productId: productId,
      basePrice: dbProduct.basePrice,
      ceilingPrice: dbProduct.ceilingPrice
    });
    
    let finalMessage = aiResponse.message;

    // 🔥 UPGRADED MOUTH-TO-BRAIN CHECK 🔥
    // If the AI accidentally reveals the exact base price too early, or goes below it:
    if (rawAiPrice <= dbProduct.basePrice && userOffer < dbProduct.basePrice) {
      // Force the counter-offer to be halfway between their offer and the ceiling to prevent jumping to the floor
      finalSafePrice = Math.floor((dbProduct.ceilingPrice + dbProduct.basePrice) / 2);
      finalMessage = `I appreciate the offer of $${userOffer}, but I simply cannot go that low. I am willing to meet you at $${finalSafePrice}.`;
    }

    const isDealClosed = finalSafePrice <= userOffer;

    if (isDealClosed) {
      finalMessage = `We have a deal at $${userOffer}. Let's get this wrapped up!`;
      finalSafePrice = userOffer; 
      
      // 💾 6. SAVE SESSION TO FIREBASE
      await db.collection('sessions').doc(sessionId).set({
        merchantId: merchantId,
        productId: productId,
        finalDealPrice: finalSafePrice,
        status: 'closed_won',
        closedAt: new Date().toISOString(),
        lastOffer: userOffer
      }, { merge: true });
    }

    return NextResponse.json({
      status: "success",
      sessionId: sessionId,
      finalPrice: finalSafePrice,
      aiMessage: finalMessage,
      dealClosed: isDealClosed 
    }, { status: 200 });

  } catch (error) {
    console.error("Negotiation API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
