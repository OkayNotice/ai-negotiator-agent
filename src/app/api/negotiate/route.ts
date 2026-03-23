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
    const body = await request.json();
    const { sessionId, userOffer, chatHistory = [] } = body;

    // We no longer need the API key here! The sessionId is our secure key.
    if (!sessionId || userOffer === undefined) {
      return NextResponse.json({ error: "Missing sessionId or userOffer." }, { status: 400 });
    }

    // 🔍 1. FETCH THE SESSION VAULT FROM FIREBASE
    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();
    
    if (!sessionSnap.exists) {
      return NextResponse.json({ error: "Session not found or expired." }, { status: 404 });
    }

    const sessionData = sessionSnap.data() as any;

    if (sessionData.status === 'closed_won') {
      return NextResponse.json({ error: "This deal has already been closed." }, { status: 400 });
    }

    // Extract the hidden prices and product name from the vault
    const { basePrice, ceilingPrice, productName } = sessionData;

    // 🧠 2. THE AI BRAIN (Now dynamically aware of what it's selling!)
    const systemPrompt = `
      You are a strict, professional AI merchant for ANCI.
      You are currently negotiating the price of a: ${productName}.
      Your goal is to get the highest price possible for this product.
      
      CRITICAL RULES:
      1. Your hidden absolute minimum price is ${basePrice}. NEVER say this exact number to the user unless they offer it first.
      2. Your starting anchor/ceiling price is ${ceilingPrice}. 
      3. If the user makes a low offer, YOU MUST REJECT IT and explicitly state a specific numerical counter-offer in your message. DO NOT be vague. DO NOT say "I need a higher price". Say something like "I can't do that, but I can offer $14,000."
      4. Always negotiate gradually down from your ceiling price. Do not drop to your minimum immediately.
      5. If the user's offer is ${basePrice} or higher, you may accept it.
      
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
      temperature: 0.2, 
    });

    const aiResponse = JSON.parse(completion.choices[0].message?.content || "{}");
    const rawAiPrice = aiResponse.proposedPrice || ceilingPrice;

    // 🛡️ 3. MATHEMATICAL GUARDRAILS
    let finalSafePrice = enforcePriceGuardrails(rawAiPrice, {
      productId: sessionData.merchantProductId, 
      basePrice: basePrice,
      ceilingPrice: ceilingPrice
    });
    
    let finalMessage = aiResponse.message;

    // 🔥 4. MOUTH-TO-BRAIN CHECK
    if (rawAiPrice <= basePrice && userOffer < basePrice) {
      finalSafePrice = Math.floor((ceilingPrice + basePrice) / 2);
      finalMessage = `I appreciate the offer of $${userOffer}, but I simply cannot go that low for the ${productName}. I am willing to meet you at $${finalSafePrice}.`;
    }

    const isDealClosed = finalSafePrice <= userOffer;

    // 💾 5. UPDATE THE SESSION VAULT
    if (isDealClosed) {
      finalMessage = `We have a deal at $${userOffer} for the ${productName}. Let's get this wrapped up!`;
      finalSafePrice = userOffer; 
      
      await sessionRef.update({
        finalDealPrice: finalSafePrice,
        status: 'closed_won',
        closedAt: new Date().toISOString(),
        lastOffer: userOffer
      });
    } else {
      // Just update their last offer so the merchant can see it live in the database
      await sessionRef.update({ lastOffer: userOffer });
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
