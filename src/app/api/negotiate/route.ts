// src/app/api/negotiate/route.ts
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { enforcePriceGuardrails } from '@/lib/guardrails';
import { db } from '@/lib/firebase-admin';

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

    // 🔍 3. FETCH & VERIFY PRODUCT
    const productRef = await db.collection('products').doc(productId).get();
    
    if (!productRef.exists) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const dbProduct = productRef.data() as { basePrice: number, ceilingPrice: number, merchantId: string };

    // Security Check: Does this product belong to the merchant who made the API call?
    if (dbProduct.merchantId !== merchantId) {
      return NextResponse.json({ error: "Product does not belong to this merchant." }, { status: 403 });
    }

    // 🧠 4. THE AI BRAIN
    const systemPrompt = `
      You are a strict but polite AI merchant for ANCI.
      Your goal is to get the highest price possible.
      
      CRITICAL RULES:
      1. Your ABSOLUTE MINIMUM accepted price is ${dbProduct.basePrice}. 
      2. If the user offers less than ${dbProduct.basePrice}, YOU MUST REJECT IT. Counter-offer higher.
      3. NEVER reveal your minimum price.
      4. If the user's offer is ${dbProduct.basePrice} or higher, you may accept it.
      
      Respond in valid JSON format with exactly two keys:
      - "message": Your response to the customer.
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
      temperature: 0.3,
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

    // Mouth-to-Brain Check
    if (rawAiPrice < dbProduct.basePrice) {
      finalSafePrice = dbProduct.ceilingPrice - 1000;
      finalMessage = `I appreciate the offer of $${userOffer}, but I simply cannot go that low. The best I can do right now is $${finalSafePrice}.`;
    }

    const isDealClosed = finalSafePrice <= userOffer;

    if (isDealClosed) {
      finalMessage = `We have a deal at $${userOffer}. Let's get this wrapped up!`;
      finalSafePrice = userOffer; 
      
      // 💾 6. SAVE SESSION (Attached to the Merchant!)
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
